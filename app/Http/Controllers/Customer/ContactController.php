<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Mail\ContactMessageMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class ContactController extends Controller
{
    public const SUBJECTS = [
        'commande' => 'Question sur une commande',
        'livraison' => 'Livraison',
        'retour' => 'Retour / échange',
        'partenariat' => 'Partenariat / vendeur',
        'autre' => 'Autre',
    ];

    public function index(): Response
    {
        return Inertia::render('customer/contact', [
            'canRegister' => Features::enabled(Features::registration()),
            'subjects' => self::SUBJECTS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'subject' => ['required', 'string', 'in:'.implode(',', array_keys(self::SUBJECTS))],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $payload = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => self::SUBJECTS[$validated['subject']],
            'message' => $validated['message'],
        ];

        $recipient = config('mail.contact_address', 'kambmusene@gmail.com');

        Mail::to($recipient)->send(new ContactMessageMail($payload));

        return back()->with('success', 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.');
    }
}
