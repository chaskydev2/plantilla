<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CV - {{ $user->name ?? 'Professional' }}</title>

    <style>
        /* DOMPDF SAFE RESET */
        @page {
            margin: 0mm;
            size: letter portrait;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            /* Mantenemos tu amarillo, pero ajustamos los grises para elegancia */
            --primary: #F5C400; 
            --sidebar-bg: #1F2224; /* Un gris casi negro, más elegante */
            --text-main: #2D2D2D;
            --text-muted: #787878;
            --bg-light: #F9F9F9;
        }

        body {
            font-family: 'DejaVu Sans', Helvetica, Arial, sans-serif;
            font-size: 9pt;
            color: var(--text-main);
            background: #ffffff;
            line-height: 1.6; /* Mayor altura de línea para legibilidad */
        }

        /* LAYOUT HELPERS */
        .clearfix:after {
            content: "";
            display: table;
            clear: both;
        }

        .full-height {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            height: 100%;
        }

        /* SIDEBAR (IZQUIERDA) - 35% Ancho */
        .sidebar {
            width: 35%;
            background-color: var(--sidebar-bg);
            color: #ffffff;
            float: left;
            height: 100%; /* Truco para DOMPDF */
            position: fixed; /* Mantiene la barra fija a la izquierda */
            left: 0;
            top: 0;
            bottom: 0;
            padding: 40px 25px;
        }

        /* MAIN CONTENT (DERECHA) - 65% Ancho */
        .main-content {
            width: 45%;
            float: right;
            padding: 40px 35px;
            background: #fff;
        }

        /* HEADER SECTION (Dentro del Main) */
        .header-section {
            margin-bottom: 35px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 20px;
        }

        .contractor-name {
            font-size: 26pt;
            font-weight: 700;
            color: #111;
            text-transform: uppercase;
            line-height: 1;
            margin-bottom: 5px;
            letter-spacing: -0.5px;
        }

        .contractor-title {
            font-size: 11pt;
            color: var(--primary);
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
        }

        .header-meta {
            font-size: 8pt;
            color: var(--text-muted);
        }

        /* SECTION STYLES */
        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }

        .section-title {
            font-size: 10pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 15px;
            color: #111;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            display: inline-block;
        }

        /* SIDEBAR SPECIFIC STYLES */
        .sidebar .section-title {
            color: #ffffff;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            margin-top: 10px;
        }

        /* INFO BOX (Sidebar) */
        .info-box {
            margin-bottom: 20px;
        }
        
        .info-label {
            display: block;
            font-size: 7pt;
            text-transform: uppercase;
            color: rgba(255,255,255,0.6);
            margin-bottom: 2px;
            letter-spacing: 1px;
        }
        
        .info-value {
            font-size: 9pt;
            font-weight: 400;
            margin-bottom: 10px;
            word-wrap: break-word;
        }

        /* SKILLS (Sidebar) */
        .skill-item {
            margin-bottom: 12px;
        }
        
        .skill-header {
            display: block;
            margin-bottom: 4px;
        }
        
        .skill-name {
            font-size: 8pt;
            font-weight: 700;
        }
        
        .skill-container {
            width: 100%;
            height: 6px;
            background: rgba(255,255,255,0.1);
            border-radius: 3px;
            overflow: hidden;
        }
        
        .skill-bar {
            height: 100%;
            background: var(--primary);
            border-radius: 3px;
        }

        /* TIMELINE EXPERIENCE (Main) */
        .experience-item {
            position: relative;
            padding-left: 20px;
            margin-bottom: 20px;
            border-left: 2px solid #f0f0f0;
        }

        /* Bullet point trick for timeline */
        .experience-item:before {
            content: '';
            position: absolute;
            left: -6px; /* Center on the border */
            top: 0;
            width: 10px;
            height: 10px;
            background: var(--primary);
            border-radius: 50%;
        }

        .exp-head {
            margin-bottom: 4px;
        }

        .exp-position {
            font-size: 11pt;
            font-weight: 700;
            color: #222;
        }

        .exp-company {
            font-size: 9pt;
            font-weight: 600;
            color: var(--text-muted);
        }

        .exp-date {
            font-size: 8pt;
            color: var(--primary);
            font-weight: 700;
            margin-bottom: 6px;
            text-transform: uppercase;
            font-size: 7.5pt;
        }

        /* EDUCATION (Sidebar style simplified) */
        .edu-item {
            margin-bottom: 15px;
            border-left: 2px solid var(--primary);
            padding-left: 10px;
        }
        .edu-degree { font-weight: 700; color: #fff; font-size: 9pt; }
        .edu-school { color: rgba(255,255,255,0.7); font-size: 8pt; }
        .edu-year { color: var(--primary); font-size: 7.5pt; font-weight: bold; }

        /* TAGS / PILLS */
        .pill {
            display: inline-block;
            background: #f0f0f0;
            color: #333;
            font-size: 7.5pt;
            font-weight: 600;
            padding: 4px 10px;
            margin: 0 4px 4px 0;
            border-radius: 4px;
            text-transform: uppercase;
        }

        /* REFERENCES TABLE */
        .ref-table {
            width: 100%;
            border-collapse: collapse;
        }
        .ref-table td {
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: 8.5pt;
        }
        .ref-name { font-weight: 700; color: #333; }
        .ref-company { color: #666; font-style: italic; }

    </style>
</head>
<body>

    <div class="sidebar">
        
        <div class="section">
            <h3 class="section-title">License Info</h3>
            <div class="info-box">
                <span class="info-label">Company</span>
                <div class="info-value" style="font-weight: 700; color: var(--primary);">{{ $contractor->company_name ?? 'Company Name' }}</div>
                
                <span class="info-label">License #</span>
                <div class="info-value">{{ $contractor->license_number ?? 'Pending' }}</div>

                @if($contractor->is_insured)
                <div style="margin-top:5px; color: var(--primary); font-size: 8pt; font-weight:bold;">
                    ✓ FULLY INSURED
                </div>
                @endif
            </div>
        </div>

        <div class="section">
            <h3 class="section-title">Contact</h3>
            
            <div class="info-box">
                <span class="info-label">Phone</span>
                <div class="info-value">{{ $contractor->mobile_number ?? 'N/A' }}</div>

                <span class="info-label">Email</span>
                <div class="info-value">{{ $user->email ?? 'email@example.com' }}</div>

                <span class="info-label">Location</span>
                <div class="info-value">
                    {{ $contractor->city }}{{ $contractor->city && $contractor->state_code ? ',' : '' }} {{ $contractor->state_code }}<br>
                    <span style="font-size:8pt; opacity:0.7">{{ $contractor->address_line1 }}</span>
                </div>
            </div>
        </div>

        @if($academicTrainings->isNotEmpty())
        <div class="section">
            <h3 class="section-title">Education</h3>
            @foreach($academicTrainings as $training)
            <div class="edu-item">
                <div class="edu-degree">{{ $training->academic_degree }}</div>
                <div class="edu-school">{{ $training->graduated_from }}</div>
                <div class="edu-year">{{ $training->graduation_date?->format('Y') }}</div>
            </div>
            @endforeach
        </div>
        @endif

        @if($technicalSkills->isNotEmpty())
        <div class="section">
            <h3 class="section-title">Expertise</h3>
            @foreach($technicalSkills as $skill)
            <div class="skill-item">
                <div class="skill-header clearfix">
                    <span class="skill-name">{{ $skill->skill_name }}</span>
                </div>
                <div class="skill-container">
                    <div class="skill-bar" style="width: {{ $skill->level ?? 70 }}%;"></div>
                </div>
            </div>
            @endforeach
        </div>
        @endif

    </div>

    <div class="main-content">
        
        <div class="header-section">
            <h1 class="contractor-name">{{ $user->name ?? 'John Doe' }}</h1>
            <div class="contractor-title">{{ $contractor->service_area ?? 'Professional Contractor' }}</div>
            
            <div class="header-meta">
                Generated on {{ date('F d, Y') }} &bull; Document ID: #{{ $contractor->license_number ?? rand(1000,9999) }}
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Professional Experience</h2>
            
            @foreach($workExperiences as $exp)
            <div class="experience-item">
                <div class="exp-date">
                    {{ $exp->start_date->format('M Y') }} — {{ $exp->end_date ? $exp->end_date->format('M Y') : 'Present' }}
                </div>
                <div class="exp-head">
                    <div class="exp-position">{{ $exp->position }}</div>
                    <div class="exp-company">{{ $exp->company_name }}</div>
                </div>
                </div>
            @endforeach
        </div>

        @if($professions->isNotEmpty())
        <div class="section">
            <h2 class="section-title">Core Competencies</h2>
            <div style="margin-top: 10px;">
                @foreach($professions as $profession)
                    <span class="pill">{{ $profession->name }}</span>
                @endforeach
            </div>
        </div>
        @endif

        @if($workReferences->isNotEmpty())
        <div class="section">
            <h2 class="section-title">References</h2>
            <table class="ref-table">
                @foreach($workReferences as $ref)
                <tr>
                    <td class="ref-name">{{ $ref->reference_name }}</td>
                    <td class="ref-company">{{ $ref->company }}</td>
                    <td style="text-align: right; color: var(--primary); font-weight: bold;">{{ $ref->phone }}</td>
                </tr>
                @endforeach
            </table>
        </div>
        @endif

    </div>

</body>
</html>