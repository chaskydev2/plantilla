<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Optimizaciones para PDF y Reset */
        @page { margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            background: #fff;
            color: #333;
            line-height: 1.4;
            display: flex;
            position: relative;
        }

        /* Anillación (Binding Holes) */
        .binding-holes {
            position: absolute;
            left: 10px;
            top: 0;
            bottom: 0;
            width: 20px;
            z-index: 10;
        }
        .hole {
            width: 15px;
            height: 15px;
            background: #fff;
            border: 2px solid #ccc;
            border-radius: 50%;
            position: absolute;
            left: 2px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }
        .hole:nth-child(1) { top: 80px; }
        .hole:nth-child(2) { top: 240px; }
        .hole:nth-child(3) { top: 400px; }
        .hole:nth-child(4) { top: 560px; }
        .hole:nth-child(5) { top: 720px; }

        /* Contenedor Principal Estilo Dos Columnas */
        .resume-container {
            display: flex;
            flex-direction: row;
            width: 100%;
            min-height: 100vh;
            margin-left: 30px;
            align-items: flex-start;
        }

        /* --- COLUMNA IZQUIERDA (NEGRA) --- */
        .sidebar {
            width: 28%;
            background-color: #000;
            color: #fff;
            padding: 20px 15px;
            position: relative;
            flex-shrink: 0;
        }
        
        /* Logo/Header Company */
        .company-header {
            text-align: center;
            padding-bottom: 8px;
            border-bottom: 2px solid #f5c400;
            margin-bottom: 12px;
        }
        .company-logo {
            width: 45px;
            height: 45px;
            background: #f5c400;
            border-radius: 50%;
            margin: 0 auto 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: bold;
            color: #000;
        }
        .company-name {
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #f5c400;
            word-break: break-word;
        }

        .sidebar-section { margin-bottom: 12px; }

        .sidebar-title {
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            border-bottom: 3px solid #f5c400;
            padding-bottom: 4px;
            margin-bottom: 10px;
            display: block;
            color: #fff;
            font-weight: 900;
            letter-spacing: 1px;
        }

        /* Contacto */
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
            font-size: 11px;
        }
        .contact-icon {
            width: 18px;
            height: 18px;
            background: linear-gradient(135deg, #f5c400, #f0b800);
            border-radius: 50%;
            margin-right: 7px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-weight: bold;
            font-size: 9px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        /* Educación en Sidebar */
        .edu-item { margin-bottom: 7px; }
        .edu-year { font-size: 9px; color: #f5c400; font-weight: bold; }
        .edu-degree { font-size: 11px; font-weight: bold; text-transform: uppercase; margin: 1px 0; line-height: 1.2; }
        .edu-school { font-size: 10px; color: #bbb; line-height: 1.2; }

        /* Skills con barras de progreso */
        .skill-item { margin-bottom: 6px; }
        .skill-name { font-size: 9px; margin-bottom: 2px; display: block; text-transform: uppercase; }
        .skill-bar-bg { background: #333; height: 2px; width: 100%; position: relative; }
        .skill-bar-fill { background: #f5c400; height: 2px; position: absolute; left: 0; top: 0; }

        /* --- COLUMNA DERECHA (BLANCA) --- */
        .main-content {
            width: 72%;
            padding: 20px 18px;
            background: #fff;
            position: relative;
            flex-shrink: 0;
        }

        /* Header Report Style */
        .report-header {
            border-bottom: 4px solid #f5c400;
            padding-bottom: 10px;
            margin-bottom: 12px;
            background: linear-gradient(to right, rgba(245,196,0,0.05), transparent);
            padding-top: 8px;
            padding-left: 6px;
        }
        .report-title {
            font-size: 9px;
            color: #999;
            letter-spacing: 2px;
            margin-bottom: 3px;
            font-weight: 600;
        }
        .report-doc-number {
            font-size: 8px;
            color: #aaa;
            float: right;
            margin-top: -25px;
            font-weight: 600;
            background: #f5c400;
            color: #000;
            padding: 2px 6px;
            border-radius: 2px;
        }

        .personal-profile { margin-bottom: 12px; }
        .section-header {
            font-size: 13px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            margin-bottom: 8px;
            color: #000;
            padding-bottom: 4px;
            border-bottom: 2px solid #f5c400;
            display: inline-block;
        }

        .profile-text { 
            font-size: 10px; 
            color: #444; 
            text-align: justify; 
            line-height: 1.4;
            padding: 6px 8px;
            background: #fafafa;
            border-left: 3px solid #f5c400;
            border-radius: 2px;
        }

        /* Línea de Tiempo de Experiencia - Ahora con Tabla */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 6px 0;
            font-size: 9px;
            border: 1px solid #e0e0e0;
        }
        .data-table thead {
            background: linear-gradient(to right, #f5c400, #f0b800);
            color: #000;
        }
        .data-table th {
            padding: 5px 6px;
            text-align: left;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 8px;
            letter-spacing: 0.5px;
            border: 1px solid #e0e0e0;
            font-weight: 900;
        }
        .data-table td {
            padding: 5px 6px;
            border-bottom: 1px solid #f0f0f0;
            color: #333;
            line-height: 1.3;
        }
        .data-table tbody tr {
            transition: all 0.2s ease;
        }
        .data-table tbody tr:nth-child(even) {
            background: #fafafa;
        }
        .data-table tbody tr:hover {
            background: #f5f5f5;
            box-shadow: inset 0 0 3px rgba(245,196,0,0.1);
        }

        /* Etiquetas para Especialidades */
        .pill-container { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
        .pill { 
            background: linear-gradient(135deg, #f2f2f2, #e8e8e8); 
            color: #333; 
            padding: 3px 8px; 
            border-radius: 3px; 
            font-size: 8px; 
            font-weight: bold; 
            text-transform: uppercase; 
            border-left: 3px solid #f5c400;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            letter-spacing: 0.3px;
        }

        /* Referencias y Equipo en cuadrícula */
        .ref-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .ref-card { 
            padding: 7px 8px; 
            background: linear-gradient(135deg, #fafafa, #f5f5f5); 
            border-radius: 3px; 
            font-size: 10px; 
            border-left: 3px solid #f5c400;
            box-shadow: 0 2px 4px rgba(0,0,0,0.08);
            line-height: 1.4;
        }
        
        /* Empty State */
        .empty { 
            font-size: 10px; 
            color: #999; 
            font-style: italic; 
            text-align: center;
            padding: 10px;
        }
        
        .section { margin-top: 8px !important; }
        
    </style>
</head>
<body>

<!-- Anillación -->
<div class="binding-holes">
    <div class="hole"></div>
    <div class="hole"></div>
    <div class="hole"></div>
    <div class="hole"></div>
    <div class="hole"></div>
</div>

<div class="resume-container">
    <div class="sidebar">
        <!-- Company Header -->
        <div class="company-header">
            <div class="company-logo">{{ strtoupper(substr($contractor->company_name ?? 'CO', 0, 2)) }}</div>
            <div class="company-name">{{ $contractor->company_name ?? 'Company Name' }}</div>
        </div>
        
        <div class="sidebar-section">
            <h3 class="sidebar-title">CONTACT INFO</h3>
            <div class="contact-item">
                <span class="contact-icon">P</span> {{ $contractor->mobile_number ?? '—' }}
            </div>
            <div class="contact-item">
                <span class="contact-icon">E</span> {{ $user->email ?? '—' }}
            </div>
            <div class="contact-item">
                <span class="contact-icon">W</span> {{ $contractor->city ?? 'Location' }}
            </div>
            <div class="contact-item">
                <span class="contact-icon">L</span> {{ $contractor->license_number ?? 'No License' }}
            </div>
        </div>

        @if($academicTrainings->isNotEmpty())
        <div class="sidebar-section">
            <h3 class="sidebar-title">EDUCATION</h3>
            @foreach($academicTrainings as $training)
            <div class="edu-item">
                <p class="edu-year">{{ $training->graduation_date ? $training->graduation_date->format('Y') : 'N/A' }}</p>
                <p class="edu-degree">{{ $training->academic_degree }}</p>
                <p class="edu-school">{{ $training->graduated_from }}</p>
            </div>
            @endforeach
        </div>
        @endif

        @if($technicalSkills->isNotEmpty())
        <div class="sidebar-section">
            <h3 class="sidebar-title">SKILLS</h3>
            @foreach($technicalSkills as $skill)
            <div class="skill-item">
                <span class="skill-name">{{ $skill->skill_name }}</span>
                <div class="skill-bar-bg">
                    <div class="skill-bar-fill" style="width: 80%;"></div>
                </div>
            </div>
            @endforeach
        </div>
        @endif
    </div>

    <div class="main-content">
        <!-- Report Header -->
        <div class="report-header">
            <p class="report-title">PROFESSIONAL CONTRACTOR REPORT</p>
            <h1 style="font-size: 19px; line-height: 1.2; margin: 2px 0; font-weight: 900; color: #000; letter-spacing: 0.5px;">{{ strtoupper($user->name) }}</h1>
            <p style="letter-spacing: 1.5px; color: #555; font-weight: 700; font-size: 10px; margin-top: 2px;">{{ strtoupper($contractor->service_area ?? 'PROFESSIONAL') }}</p>
            <p class="report-doc-number">Doc. #{{ $contractor->license_number ?? 'N/A' }} | {{ date('d/m/Y') }}</p>
        </div>

        <div class="section">
            <h3 class="section-header">Personal Profile</h3>
            <p class="profile-text">
                {{ $contractor->company_description ?? 'Professional contractor dedicated to providing high-quality services in their area of expertise, focused on efficiency and excellence.' }}
            </p>
        </div>

        <div class="section">
            <h3 class="section-header">Work Experience</h3>
            @if($workExperiences->isNotEmpty())
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 30%;">POSITION</th>
                        <th style="width: 35%;">COMPANY</th>
                        <th style="width: 18%;">START DATE</th>
                        <th style="width: 17%;">END DATE</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($workExperiences as $exp)
                    <tr>
                        <td><strong>{{ $exp->position }}</strong></td>
                        <td>{{ $exp->company_name }}</td>
                        <td>{{ $exp->start_date->format('m/Y') }}</td>
                        <td>{{ $exp->end_date ? $exp->end_date->format('m/Y') : 'Present' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
            @else
            <p class="empty">No work experience registered</p>
            @endif
        </div>

        <div class="section">
            <h3 class="section-header">Specialties</h3>
            <div class="pill-container">
                @foreach($professions as $profession)
                    <span class="pill">{{ $profession->name }}</span>
                @endforeach
            </div>
        </div>

        @if($workReferences->isNotEmpty())
        <div class="section">
            <h3 class="section-header">Professional References</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 30%;">NAME</th>
                        <th style="width: 25%;">POSITION</th>
                        <th style="width: 25%;">COMPANY</th>
                        <th style="width: 20%;">PHONE</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($workReferences as $ref)
                    <tr>
                        <td><strong>{{ $ref->reference_name }}</strong></td>
                        <td>{{ $ref->position ?? '—' }}</td>
                        <td>{{ $ref->company ?? '—' }}</td>
                        <td>{{ $ref->phone ?? '—' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif
        
        @if($team->isNotEmpty())
        <div class="section">
            <h3 class="section-header">Work Team</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width: 50%;">MEMBER NAME</th>
                        <th style="width: 50%;">SPECIALTY</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($team as $member)
                    <tr>
                        <td><strong>{{ $member->user->name ?? 'Member' }}</strong></td>
                        <td>{{ $member->professions->isNotEmpty() ? $member->professions->first()->name : '—' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif
    </div>
</div>

</body>
</html>