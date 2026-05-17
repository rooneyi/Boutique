<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordResetOtpNotification extends Notification
{
    use Queueable;

    public function __construct(public string $code) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Code de vérification · POSE COMME JAMAIS')
            ->greeting('Bonjour,')
            ->line('Voici votre code de réinitialisation de mot de passe :')
            ->line('**'.$this->code.'**')
            ->line('Ce code expire dans 10 minutes.')
            ->line('Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.');
    }
}
