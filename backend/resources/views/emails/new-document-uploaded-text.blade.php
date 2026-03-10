TASKTIDE — New Document Uploaded
=================================

Hi {{ $recipient->name }},

A new document has been uploaded to {{ $document->unit->name }}.

DOCUMENT DETAILS
----------------
Title:       {{ $document->title }}
Type:        {{ ucwords(str_replace('_', ' ', $document->document_type)) }}
File:        {{ $document->file_name }}
Size:        {{ $document->formattedSize() }}
Uploaded By: {{ $document->uploader->name }}
Uploaded At: {{ $document->created_at->format('D, d M Y \a\t H:i') }}

UNIT:        {{ $document->unit->name }} ({{ $document->unit->unit_code }})

View the document here:
{{ config('app.url') }}/units/{{ $document->unit_id }}/documents

---
You're receiving this because you're enrolled in {{ $document->unit->name }}.
This notification was sent to {{ $recipient->email }}.

© {{ date('Y') }} TaskTide. All rights reserved.
