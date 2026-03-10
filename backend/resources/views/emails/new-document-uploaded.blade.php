<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Document — TaskTide</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'PT Sans', Arial, sans-serif;
            background-color: #ECEFF1;
            color: #37474F;
            padding: 40px 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .header {
            background: linear-gradient(135deg, #673AB7, #3F51B5);
            padding: 40px 40px 32px;
            text-align: center;
        }
        .header .logo {
            font-size: 28px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 1px;
        }
        .header .logo span { color: #CE93D8; }
        .header .tagline {
            color: rgba(255,255,255,0.75);
            font-size: 13px;
            margin-top: 6px;
        }
        .body { padding: 40px; }
        .greeting {
            font-size: 22px;
            font-weight: 700;
            color: #37474F;
            margin-bottom: 16px;
        }
        .intro {
            font-size: 15px;
            line-height: 1.7;
            color: #546E7A;
            margin-bottom: 28px;
        }
        .doc-card {
            background: #F8F9FA;
            border: 1px solid #ECEFF1;
            border-radius: 10px;
            padding: 24px;
            margin-bottom: 28px;
            display: flex;
            align-items: flex-start;
            gap: 18px;
        }
        .doc-icon {
            width: 52px;
            height: 52px;
            background: linear-gradient(135deg, #673AB7, #3F51B5);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            flex-shrink: 0;
        }
        .doc-info { flex: 1; }
        .doc-title {
            font-size: 17px;
            font-weight: 700;
            color: #37474F;
            margin-bottom: 6px;
        }
        .doc-meta {
            font-size: 13px;
            color: #90A4AE;
            line-height: 1.6;
        }
        .doc-type-badge {
            display: inline-block;
            background: #EDE7F6;
            color: #673AB7;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 3px 10px;
            border-radius: 20px;
            margin-top: 8px;
        }
        .info-row {
            display: flex;
            gap: 16px;
            margin-bottom: 28px;
        }
        .info-card {
            flex: 1;
            background: #F3E5F5;
            border-left: 4px solid #673AB7;
            border-radius: 8px;
            padding: 16px 20px;
        }
        .info-card .label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #673AB7;
            margin-bottom: 4px;
        }
        .info-card .value {
            font-size: 15px;
            font-weight: 600;
            color: #37474F;
        }
        .btn-row { text-align: center; margin: 32px 0; }
        .btn {
            display: inline-block;
            padding: 14px 36px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 700;
            text-decoration: none;
            background: linear-gradient(135deg, #673AB7, #3F51B5);
            color: #ffffff;
        }
        .divider {
            border: none;
            border-top: 1px solid #ECEFF1;
            margin: 32px 0;
        }
        .footer {
            background: #FAFAFA;
            padding: 24px 40px;
            text-align: center;
        }
        .footer p { font-size: 12px; color: #B0BEC5; line-height: 1.6; }
        .footer a { color: #673AB7; text-decoration: none; }

        @php
            $icons = [
                'lecture_notes' => '📖',
                'past_papers' => '📝',
                'revision_materials' => '🔖',
                'exam_timetable' => '📅',
                'lecture_timetable' => '🗓️',
                'other' => '📄',
            ];
            $typeLabels = [
                'lecture_notes' => 'Lecture Notes',
                'past_papers' => 'Past Papers',
                'revision_materials' => 'Revision Materials',
                'exam_timetable' => 'Exam Timetable',
                'lecture_timetable' => 'Lecture Timetable',
                'other' => 'Document',
            ];
            $icon = $icons[$document->document_type] ?? '📄';
            $typeLabel = $typeLabels[$document->document_type] ?? 'Document';
        @endphp
    </style>
</head>
<body>
    @php
        $icons = [
            'lecture_notes' => '📖',
            'past_papers' => '📝',
            'revision_materials' => '🔖',
            'exam_timetable' => '📅',
            'lecture_timetable' => '🗓️',
            'other' => '📄',
        ];
        $typeLabels = [
            'lecture_notes' => 'Lecture Notes',
            'past_papers' => 'Past Papers',
            'revision_materials' => 'Revision Materials',
            'exam_timetable' => 'Exam Timetable',
            'lecture_timetable' => 'Lecture Timetable',
            'other' => 'Document',
        ];
        $icon = $icons[$document->document_type] ?? '📄';
        $typeLabel = $typeLabels[$document->document_type] ?? 'Document';
    @endphp

    <div class="container">
        <div class="header">
            <div class="logo">Task<span>Tide</span></div>
            <div class="tagline">Your academic collaboration platform</div>
        </div>

        <div class="body">
            <div class="greeting">New document available! {{ $icon }}</div>

            <p class="intro">
                Hi <strong>{{ $recipient->name }}</strong>, a new document has been uploaded
                to <strong>{{ $document->unit->name }}</strong> by
                <strong>{{ $document->uploader->name }}</strong>.
            </p>

            <div class="doc-card">
                <div class="doc-icon">{{ $icon }}</div>
                <div class="doc-info">
                    <div class="doc-title">{{ $document->title }}</div>
                    <div class="doc-meta">
                        {{ $document->file_name }}<br>
                        {{ $document->formattedSize() }}
                        &bull; Uploaded {{ $document->created_at->format('d M Y \a\t H:i') }}
                    </div>
                    <div class="doc-type-badge">{{ $typeLabel }}</div>
                </div>
            </div>

            <div class="info-row">
                <div class="info-card">
                    <div class="label">Unit</div>
                    <div class="value">{{ $document->unit->name }}</div>
                </div>
                <div class="info-card">
                    <div class="label">Uploaded By</div>
                    <div class="value">{{ $document->uploader->name }}</div>
                </div>
            </div>

            <div class="btn-row">
                <a href="{{ config('app.url') }}/units/{{ $document->unit_id }}/documents" class="btn">
                    View Document →
                </a>
            </div>

            <hr class="divider">

            <p style="font-size: 13px; color: #90A4AE; line-height: 1.6;">
                You're receiving this because you're enrolled in <strong>{{ $document->unit->name }}</strong>.
                This notification was sent to <strong>{{ $recipient->email }}</strong>.
            </p>
        </div>

        <div class="footer">
            <p>
                © {{ date('Y') }} TaskTide. All rights reserved.<br>
                <a href="#">Privacy Policy</a> &bull; <a href="#">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>
