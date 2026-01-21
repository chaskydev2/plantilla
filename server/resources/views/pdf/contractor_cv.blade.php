<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CV - {{ $user->name ?? 'Professional' }}</title>
    <style>
        /* Optimizaciones para dompdf */
        @page { 
            margin: 0mm;
            size: letter portrait;
        }
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body { 
            font-family: 'DejaVu Sans', 'Arial', sans-serif; 
            background: #ffffff;
            color: #1a1a1a;
            line-height: 1.3;
            font-size: 9pt;
            position: relative;
        }

        /* Contenedor Principal */
        .resume-container {
            width: 100%;
            min-height: 100vh;
            position: relative;
        }
        
        /* Header con colores amarillos */
        .header-section {
            background: #F5C400;
            padding: 18px 30px;
            color: #1a1a1a;
            position: relative;
            border-bottom: 3px solid #000000;
        }
        
        .header-content {
            position: relative;
        }
        
        .contractor-name {
            font-size: 26pt;
            font-weight: 900;
            letter-spacing: 1px;
            margin-bottom: 5px;
            text-transform: uppercase;
            color: #000000;
        }
        
        .contractor-title {
            font-size: 12pt;
            font-weight: 700;
            color: #1a1a1a;
            letter-spacing: 1.5px;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        
        .header-info {
            margin-top: 8px;
            border-top: 2px solid rgba(0,0,0,0.3);
            padding-top: 8px;
        }
        
        .info-row {
            margin-bottom: 4px;
            font-size: 8pt;
        }
        
        .info-label {
            display: inline-block;
            width: 110px;
            font-weight: 900;
            color: #000000;
        }
        
        .info-value {
            color: #1a1a1a;
            font-weight: 600;
        }

        
        /* Contenedor de dos columnas */
        .body-section {
            padding: 0;
            margin: 0;
        }
        
        .sidebar {
            width: 32%;
            float: left;
            background: #1a1a1a;
            min-height: 700px;
            padding: 18px 15px;
            color: #ffffff;
        }
        
        .main-content {
            width: 68%;
            float: right;
            padding: 18px 25px;
            background: #ffffff;
        }
        
        /* Secciones */
        .section {
            margin-bottom: 12px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 11pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #1a1a1a;
            border-bottom: 3px solid #F5C400;
            padding-bottom: 4px;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        
        .sidebar .section-title {
            color: #F5C400;
            border-bottom-color: #F5C400;
        }
        
        /* Profile/About */
        .profile-text {
            font-size: 8pt;
            line-height: 1.4;
            text-align: justify;
            color: #333333;
            padding: 8px 10px;
            background: #fffef5;
            border-left: 4px solid #F5C400;
            margin-top: 6px;
        }
        
        /* Company Info en Sidebar */
        .company-box {
            background: rgba(245, 196, 0, 0.15);
            padding: 10px;
            margin-bottom: 10px;
            border-left: 4px solid #F5C400;
        }
        
        .company-name-text {
            font-size: 10pt;
            font-weight: 900;
            color: #F5C400;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }
        
        .company-license {
            font-size: 8pt;
            color: #cccccc;
            margin-top: 3px;
        }
        
        /* Contact Items */
        .contact-list {
            margin-top: 8px;
        }
        
        .contact-item {
            margin-bottom: 6px;
            padding-left: 20px;
            position: relative;
            font-size: 8pt;
            line-height: 1.3;
            color: #ffffff;
        }
        
        .contact-item:before {
            content: '●';
            position: absolute;
            left: 0;
            color: #F5C400;
            font-size: 11pt;
        }
        
        /* Education Items */
        .edu-item {
            margin-bottom: 8px;
            padding: 8px;
            background: rgba(245, 196, 0, 0.08);
            border-left: 3px solid #F5C400;
        }
        
        .edu-year {
            font-size: 7pt;
            color: #F5C400;
            font-weight: 700;
            margin-bottom: 3px;
        }
        
        .edu-degree {
            font-size: 8pt;
            font-weight: 700;
            margin-bottom: 2px;
            text-transform: uppercase;
            color: #ffffff;
        }
        
        .edu-school {
            font-size: 7pt;
            color: #cccccc;
            font-style: italic;
        }
        
        /* Skills */
        .skill-item {
            margin-bottom: 8px;
        }
        
        .skill-name {
            font-size: 7pt;
            margin-bottom: 3px;
            font-weight: 700;
            color: #ffffff;
            text-transform: uppercase;
        }
        
        .skill-bar {
            background: rgba(255,255,255,0.15);
            height: 6px;
            border-radius: 3px;
            overflow: hidden;
            position: relative;
        }
        
        .skill-bar-fill {
            background: #F5C400;
            height: 100%;
            border-radius: 3px;
        }
        
        /* Tables */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
            font-size: 7pt;
        }
        
        .data-table thead {
            background: #1a1a1a;
            color: #F5C400;
        }
        
        .data-table th {
            padding: 6px 8px;
            text-align: left;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 7pt;
            letter-spacing: 0.5px;
            border: 1px solid #1a1a1a;
        }
        
        .data-table td {
            padding: 6px 8px;
            border: 1px solid #e8e8e8;
            color: #1a1a1a;
            line-height: 1.3;
            font-size: 7pt;
        }
        
        .data-table tbody tr:nth-child(even) {
            background: #fffef5;
        }
        
        .data-table tbody tr:nth-child(odd) {
            background: #ffffff;
        }
        
        /* Experience Timeline */
        .experience-item {
            margin-bottom: 22px;
            padding: 16px;
            background: #fffef5;
            border-left: 5px solid #F5C400;
            page-break-inside: avoid;
        }
        
        .exp-header {
            margin-bottom: 10px;
        }
        
        .exp-position {
            font-size: 11pt;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 4px;
        }
        
        .exp-company {
            font-size: 10pt;
            color: #666666;
            font-weight: 600;
        }
        
        .exp-dates {
            font-size: 8pt;
            color: #999999;
            margin-top: 6px;
            font-style: italic;
        }
        
        /* Pills/Tags */
        .pill-container {
            margin-top: 6px;
        }
        
        .pill {
            display: inline-block;
            background: #F5C400;
            color: #1a1a1a;
            padding: 4px 8px;
            margin: 3px 3px 3px 0;
            border-radius: 3px;
            font-size: 7pt;
            font-weight: 700;
            border: 1px solid #1a1a1a;
            text-transform: uppercase;
        }
        
        /* Empty State */
        .empty {
            font-size: 8pt;
            color: #999999;
            font-style: italic;
            text-align: center;
            padding: 12px;
            background: #f9f9f9;
        }
        
        /* Utility */
        .clearfix:after {
            content: "";
            display: table;
            clear: both;
        }
        
        .text-muted {
            color: #666666;
        }
        
        .text-bold {
            font-weight: 700;
        }
        
    </style>
</head>
<body>

<div class="resume-container">
    <!-- Header Section -->
    <div class="header-section">
        <div class="header-content">
            <h1 class="contractor-name">{{ strtoupper($user->name ?? 'Professional Name') }}</h1>
            <p class="contractor-title">{{ strtoupper($contractor->service_area ?? 'Professional Contractor') }}</p>
            
            <div class="header-info">
                <div class="info-row">
                    <span class="info-label">Document #:</span>
                    <span class="info-value">{{ $contractor->license_number ?? 'N/A' }}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date:</span>
                    <span class="info-value">{{ date('F d, Y') }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Body with Sidebar and Main Content -->
    <div class="body-section clearfix">
        <!-- Sidebar -->
        <div class="sidebar">
            <!-- Company Info -->
            <div class="section">
                <h3 class="section-title">Company Info</h3>
                <div class="company-box">
                    <div class="company-name-text">{{ $contractor->company_name ?? 'Company Name' }}</div>
                    <div class="company-license">License: {{ $contractor->license_number ?? 'Not Available' }}</div>
                    @if($contractor->is_insured)
                    <div class="company-license" style="color: #F5C400; margin-top: 5px; font-weight: 700;">✓ Insured</div>
                    @endif
                </div>
            </div>

            <!-- Contact Information -->
            <div class="section">
                <h3 class="section-title">Contact</h3>
                <div class="contact-list">
                    @if($contractor->mobile_number)
                    <div class="contact-item">{{ $contractor->mobile_number }}</div>
                    @endif
                    @if($user->email)
                    <div class="contact-item">{{ $user->email }}</div>
                    @endif
                    @if($contractor->city)
                    <div class="contact-item">{{ $contractor->city }}@if($contractor->state_code), {{ $contractor->state_code }}@endif</div>
                    @endif
                    @if($contractor->address_line1)
                    <div class="contact-item">{{ $contractor->address_line1 }}</div>
                    @endif
                </div>
            </div>

            <!-- Education -->
            @if($academicTrainings->isNotEmpty())
            <div class="section">
                <h3 class="section-title">Education</h3>
                @foreach($academicTrainings as $training)
                <div class="edu-item">
                    <div class="edu-year">{{ $training->graduation_date ? $training->graduation_date->format('Y') : 'N/A' }}</div>
                    <div class="edu-degree">{{ $training->academic_degree }}</div>
                    <div class="edu-school">{{ $training->graduated_from }}</div>
                </div>
                @endforeach
            </div>
            @endif

            <!-- Technical Skills -->
            @if($technicalSkills->isNotEmpty())
            <div class="section">
                <h3 class="section-title">Skills</h3>
                @foreach($technicalSkills as $skill)
                <div class="skill-item">
                    <div class="skill-name">{{ $skill->skill_name }}</div>
                    <div class="skill-bar">
                        <div class="skill-bar-fill" style="width: 85%;"></div>
                    </div>
                </div>
                @endforeach
            </div>
            @endif
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Professional Profile -->
            <div class="section">
                <h2 class="section-title">Professional Profile</h2>
                <p class="profile-text">
                    {{ $contractor->company_description ?? 'Experienced professional contractor dedicated to delivering high-quality services with a focus on customer satisfaction, efficiency, and excellence in every project. Committed to maintaining the highest standards of workmanship and professional conduct.' }}
                </p>
            </div>
            
            <!-- Work Experience -->
            <div class="section">
                <h2 class="section-title">Work Experience</h2>
                @if($workExperiences->isNotEmpty())
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 30%;">Position</th>
                            <th style="width: 35%;">Company</th>
                            <th style="width: 18%;">Start Date</th>
                            <th style="width: 17%;">End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($workExperiences as $exp)
                        <tr>
                            <td class="text-bold">{{ $exp->position }}</td>
                            <td>{{ $exp->company_name }}</td>
                            <td class="text-muted">{{ $exp->start_date->format('M Y') }}</td>
                            <td class="text-muted">{{ $exp->end_date ? $exp->end_date->format('M Y') : 'Present' }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
                @else
                <p class="empty">No work experience registered</p>
                @endif
            </div>

            <!-- Specialties/Professions -->
            <div class="section">
                <h2 class="section-title">Specialties & Expertise</h2>
                <div class="pill-container">
                    @forelse($professions as $profession)
                        <span class="pill">{{ $profession->name }}</span>
                    @empty
                        <p class="empty">No specialties registered</p>
                    @endforelse
                </div>
            </div>

            <!-- Professional References -->
            @if($workReferences->isNotEmpty())
            <div class="section">
                <h2 class="section-title">Professional References</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 30%;">Name</th>
                            <th style="width: 25%;">Position</th>
                            <th style="width: 25%;">Company</th>
                            <th style="width: 20%;">Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($workReferences as $ref)
                        <tr>
                            <td class="text-bold">{{ $ref->reference_name }}</td>
                            <td>{{ $ref->position ?? '—' }}</td>
                            <td>{{ $ref->company ?? '—' }}</td>
                            <td class="text-muted">{{ $ref->phone ?? '—' }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @endif
            
            <!-- Work Team -->
            @if($team->isNotEmpty())
            <div class="section">
                <h2 class="section-title">Work Team</h2>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 50%;">Team Member</th>
                            <th style="width: 50%;">Specialty</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($team as $member)
                        <tr>
                            <td class="text-bold">{{ $member->user->name ?? 'Team Member' }}</td>
                            <td>{{ $member->professions->isNotEmpty() ? $member->professions->first()->name : '—' }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            @endif
        </div>
    </div>
</div>

</body>
</html>