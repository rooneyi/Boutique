<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array{name: string, email: string, subject: string, message: string}  $payload
     */
    public function __construct(public array $payload) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [$this->payload['email']],
            subject: '[PCJ Contact] '.$this->payload['subject'],
        );
    }

    public function content(): Content
    {
        return new Content(
            text: 'mail.contact-message',
        );
    }
}
