<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contractor_message_threads', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('contractor_user_id');
            $table->string('participant_type', 50)->default('guest');
            $table->unsignedBigInteger('participant_user_id')->nullable();
            $table->string('guest_name')->nullable();
            $table->string('guest_email')->nullable();
            $table->string('status', 50)->default('open');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->foreign('contractor_user_id')
                ->references('user_id')
                ->on('contractors')
                ->onDelete('cascade');

            $table->foreign('participant_user_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->index(['contractor_user_id', 'status'], 'contractor_threads_status_idx');
            $table->index(['participant_type', 'participant_user_id'], 'contractor_threads_participant_idx');
            $table->unique(
                ['contractor_user_id', 'participant_type', 'participant_user_id', 'guest_email'],
                'threads_unique_participant'
            );
        });

        Schema::table('contractor_messages', function (Blueprint $table) {
            $table->unsignedBigInteger('thread_id')->nullable()->after('id');
            $table->timestamp('sent_at')->nullable()->after('message');
            $table->timestamp('read_at')->nullable()->after('sent_at');
            $table->unsignedBigInteger('message_number')->nullable()->after('status');

            $table->foreign('thread_id')
                ->references('id')
                ->on('contractor_message_threads')
                ->onDelete('cascade');

            $table->index(['thread_id', 'sent_at']);
            $table->index('message_number');
        });

        DB::table('contractor_messages')->whereNull('sent_at')->update([
            'sent_at' => DB::raw('created_at'),
        ]);

        DB::table('contractor_messages')->whereNull('message_number')->update([
            'message_number' => DB::raw('id'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contractor_messages', function (Blueprint $table) {
            $table->dropForeign(['thread_id']);
            $table->dropIndex('contractor_messages_thread_id_sent_at_index');
            $table->dropIndex('contractor_messages_message_number_index');
            $table->dropColumn(['thread_id', 'sent_at', 'read_at', 'message_number']);
        });

        Schema::dropIfExists('contractor_message_threads');
    }
};
