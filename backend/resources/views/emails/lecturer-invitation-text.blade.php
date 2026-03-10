TASKTIDE — Lecturer Invitation
==============================

You've been invited to teach!

{{ $invitation->inviter->name }} has invited you to join TaskTide as a lecturer.

UNIT DETAILS
------------
Unit:          {{ $invitation->unit->name }}
Code:          {{ $invitation->unit->unit_code }}
Course Server: {{ $invitation->unit->courseServer->name }}
Invited By:    {{ $invitation->inviter->name }} (Class Representative)

This invitation expires on: {{ $invitation->expires_at->format('D, d M Y \a\t H:i') }}

ACCEPT INVITATION:
{{ $acceptUrl }}

DECLINE INVITATION:
{{ $rejectUrl }}

---
If you weren't expecting this invitation, you can safely ignore this email.
This invitation was sent to {{ $invitation->email }}.

© {{ date('Y') }} TaskTide. All rights reserved.
