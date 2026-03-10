<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'unit_id',
        'uploaded_by',
        'title',
        'document_type',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    /**
     * Relationships
     */

    // Unit this document belongs to
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    // User who uploaded this document
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Helper methods
     */

    // Get the full URL to the document
    public function url(): string
    {
        return Storage::url($this->file_path);
    }

    // Get formatted file size
    public function formattedSize(): string
    {
        $size = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $size > 1024 && $i < count($units) - 1; $i++) {
            $size /= 1024;
        }

        return round($size, 2) . ' ' . $units[$i];
    }

    // Check if document is an image
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    // Check if document is a PDF
    public function isPdf(): bool
    {
        return $this->mime_type === 'application/pdf';
    }

    // Get icon based on file type
    public function icon(): string
    {
        if ($this->isPdf()) {
            return 'file-pdf';
        } elseif ($this->isImage()) {
            return 'file-image';
        } elseif (str_starts_with($this->mime_type, 'video/')) {
            return 'file-video';
        } elseif (str_contains($this->mime_type, 'word')) {
            return 'file-word';
        } elseif (str_contains($this->mime_type, 'excel') || str_contains($this->mime_type, 'spreadsheet')) {
            return 'file-excel';
        } else {
            return 'file';
        }
    }

    // Delete file when model is deleted
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($document) {
            if ($document->isForceDeleting()) {
                Storage::delete($document->file_path);
            }
        });
    }
}
