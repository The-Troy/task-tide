<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lecturer Invitation — TaskTide</title>
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
        .header .logo span {
            color: #CE93D8;
        }
        .header .tagline {
            color: rgba(255,255,255,0.75);
            font-size: 13px;
            margin-top: 6px;
        }
        .body {
            padding: 40px;
        }
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
        .info-card {
            background: #F3E5F5;
            border-left: 4px solid #673AB7;
            border-radius: 8px;
            padding: 20px 24px;
            margin-bottom: 28px;
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
            font-size: 16px;
            font-weight: 600;
            color: #37474F;
        }
        .info-card .sub-value {
            font-size: 13px;
            color: #78909C;
            margin-top: 4px;
        }
        .info-row {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
        }
        .info-row .info-card {
            flex: 1;
            margin-bottom: 0;
        }
        .action-section {
            text-align: center;
            margin: 32px 0;
        }
        .action-section p {
            font-size: 14px;
            color: #78909C;
            margin-bottom: 20px;
        }
        .btn-row {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .btn {
            display: inline-block;
            padding: 14px 32px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 700;
            text-decoration: none;
            letter-spacing: 0.3px;
        }
        .btn-accept {
            background: linear-gradient(135deg, #673AB7, #3F51B5);
            color: #ffffff;
        }
        .btn-reject {
            background: #ECEFF1;
            color: #546E7A;
            border: 2px solid #CFD8DC;
        }
        .expires {
            text-align: center;
            font-size: 13px;
            color: #B0BEC5;
            margin-top: 20px;
        }
        .expires strong {
            color: #78909C;
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
        .footer p {
            font-size: 12px;
            color: #B0BEC5;
            line-height: 1.6;
        }
        .footer a {
            color: #673AB7;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Task<span>Tide</span></div>
            <div class="tagline">Your academic collaboration platform</div>
        </div>

        <div class="body">
            <div class="greeting">You've been invited to teach! 🎓</div>

            <p class="intro">
                <strong>{{ $invitation->inviter->name }}</strong> has invited you to join
                <strong>TaskTide</strong> as a lecturer. You'll be teaching a unit in their
                course server and can upload documents, resources, and interact with students.
            </p>

            <div class="info-card">
                <div class="label">Unit</div>
                <div class="value">{{ $invitation->unit->name }}</div>
                <div class="sub-value">
                    {{ $invitation->unit->unit_code }}
                    @if($invitation->unit->credits)
                        &bull; {{ $invitation->unit->credits }} credits
                    @endif
                </div>
            </div>

            <div class="info-row">
                <div class="info-card">
                    <div class="label">Course Server</div>
                    <div class="value">{{ $invitation->unit->courseServer->name }}</div>
                </div>
                <div class="info-card">
                    <div class="label">Invited By</div>
                    <div class="value">{{ $invitation->inviter->name }}</div>
                    <div class="sub-value">Class Representative</div>
                </div>
            </div>

            <div class="action-section">
                <p>This invitation expires on <strong>{{ $invitation->expires_at->format('D, d M Y \a\t H:i') }}</strong>.</p>
                <div class="btn-row">
                    <a href="{{ $acceptUrl }}" class="btn btn-accept">✓ Accept Invitation</a>
                    <a href="{{ $rejectUrl }}" class="btn btn-reject">✗ Decline</a>
                </div>
            </div>

            <div class="expires">
                Not sure? You can also visit your invitation link directly:<br>
                <a href="{{ $acceptUrl }}" style="color: #673AB7; font-size: 12px;">{{ $acceptUrl }}</a>
            </div>

            <hr class="divider">

            <p style="font-size: 13px; color: #90A4AE; line-height: 1.6;">
                If you weren't expecting this invitation, you can safely ignore this email.
                This invitation was sent to <strong>{{ $invitation->email }}</strong>.
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
