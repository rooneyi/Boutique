<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class RefundPolicyController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('customer/refund-policy', [
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
}
