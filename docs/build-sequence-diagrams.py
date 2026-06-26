#!/usr/bin/env python3
"""Genere docs/diagrammes-sequence.drawio et docs/sequences/*.drawio (UML sequence)."""

from __future__ import annotations

import uuid
import xml.etree.ElementTree as ET
import xml.sax.saxutils as xs
from dataclasses import dataclass, field
from pathlib import Path

OUT = Path(__file__).parent / 'diagrammes-sequence.drawio'
OUT_DIR = Path(__file__).parent / 'sequences'


def esc(value: str) -> str:
    return xs.escape(value, {'"': '&quot;', "'": '&apos;'})


def cid() -> str:
    return uuid.uuid4().hex[:12]


@dataclass
class Message:
    src: int
    dst: int
    label: str
    kind: str = 'sync'  # sync | return | async
    note: str = ''


@dataclass
class AltBlock:
    label: str
    y_index: float  # position relative in message flow
    messages: list[Message] = field(default_factory=list)


@dataclass
class SequenceDiagram:
    name: str
    title: str
    participants: list[str]
    slug: str = ''
    messages: list[Message] = field(default_factory=list)
    alts: list[AltBlock] = field(default_factory=list)

    def msg(self, src: int, dst: int, label: str, kind: str = 'sync') -> None:
        self.messages.append(Message(src, dst, label, kind))

    def ret(self, src: int, dst: int, label: str = '') -> None:
        self.messages.append(Message(src, dst, label, 'return'))


def build_diagram_xml(diagram: SequenceDiagram) -> str:
    cells: list[str] = []
    ids: dict[str, str] = {}

    n = len(diagram.participants)
    page_w = max(900, n * 160 + 120)
    page_h = 120 + len(diagram.messages) * 52 + 80
    spacing = page_w / (n + 1)

    cells.append('<mxCell id="0"/>')
    cells.append('<mxCell id="1" parent="0"/>')

    title_id = cid()
    cells.append(
        f'<mxCell id="{title_id}" value="{esc(diagram.title)}" '
        f'style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;'
        f'fontStyle=1;fontSize=14;fontFamily=Helvetica;" vertex="1" parent="1">'
        f'<mxGeometry x="40" y="10" width="{page_w - 80}" height="30" as="geometry"/></mxCell>'
    )

    lifeline_ids: list[str] = []
    lifeline_x: list[float] = []

    for i, name in enumerate(diagram.participants):
        lid = cid()
        lifeline_ids.append(lid)
        x = spacing * (i + 1) - 55
        lifeline_x.append(x + 55)

        is_actor = i == 0 and name.lower() in {'client', 'admin', 'administrateur', 'invite'}
        if is_actor:
            style = (
                'shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;'
                'outlineConnect=0;fillColor=#f5f5f5;strokeColor=#666666;fontFamily=Helvetica;fontSize=11;'
            )
            w, h, y = 40, 60, 48
            gx = x + 35
        else:
            style = (
                'rounded=0;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;'
                'fontFamily=Helvetica;fontSize=11;fontStyle=0;align=center;'
            )
            w, h, y = 110, 36, 50
            gx = x

        display = name if name.startswith(':') else f':{name}'
        cells.append(
            f'<mxCell id="{lid}" value="{esc(display)}" style="{style}" vertex="1" parent="1">'
            f'<mxGeometry x="{gx}" y="{y}" width="{w}" height="{h}" as="geometry"/></mxCell>'
        )

        line_id = cid()
        line_bottom = page_h - 40
        cells.append(
            f'<mxCell id="{line_id}" value="" style="endArrow=none;dashed=1;html=1;strokeWidth=1;'
            f'strokeColor=#999999;" edge="1" parent="1">'
            f'<mxGeometry relative="1" as="geometry">'
            f'<mxPoint x="{lifeline_x[i]}" y="{y + h + 4}" as="sourcePoint"/>'
            f'<mxPoint x="{lifeline_x[i]}" y="{line_bottom}" as="targetPoint"/>'
            f'</mxGeometry></mxCell>'
        )

    y0 = 120
    for step, message in enumerate(diagram.messages, start=1):
        mid = cid()
        y = y0 + (step - 1) * 48
        src_x = lifeline_x[message.src]
        dst_x = lifeline_x[message.dst]

        if message.kind == 'return':
            style = (
                'endArrow=open;endFill=0;dashed=1;html=1;strokeColor=#666666;'
                'fontFamily=Helvetica;fontSize=10;'
            )
        elif message.kind == 'async':
            style = (
                'endArrow=block;endFill=0;dashed=1;html=1;strokeColor=#333333;'
                'fontFamily=Helvetica;fontSize=10;'
            )
        else:
            style = (
                'endArrow=block;endFill=1;html=1;strokeColor=#333333;'
                'fontFamily=Helvetica;fontSize=10;'
            )

        label = f'{step}. {message.label}' if message.label else f'{step}.'
        if message.src == message.dst:
            loop_x = src_x + 48
            y_end = y + 24
            cells.append(
                f'<mxCell id="{mid}" value="{esc(label)}" style="{style}" edge="1" parent="1">'
                f'<mxGeometry relative="1" as="geometry">'
                f'<Array as="points"><mxPoint x="{loop_x}" y="{y}"/></Array>'
                f'<mxPoint x="{src_x}" y="{y}" as="sourcePoint"/>'
                f'<mxPoint x="{src_x}" y="{y_end}" as="targetPoint"/>'
                f'</mxGeometry></mxCell>'
            )
        else:
            cells.append(
                f'<mxCell id="{mid}" value="{esc(label)}" style="{style}" edge="1" parent="1">'
                f'<mxGeometry relative="1" as="geometry">'
                f'<mxPoint x="{src_x}" y="{y}" as="sourcePoint"/>'
                f'<mxPoint x="{dst_x}" y="{y}" as="targetPoint"/>'
                f'</mxGeometry></mxCell>'
            )

    diagram_id = cid()
    inner = '\n        '.join(cells)
    return f'''  <diagram id="{diagram_id}" name="{esc(diagram.name)}">
    <mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{page_w}" pageHeight="{page_h}" math="0" shadow="0">
      <root>
        {inner}
      </root>
    </mxGraphModel>
  </diagram>'''


def global_diagram() -> SequenceDiagram:
    d = SequenceDiagram(
        '01 - Global',
        'Diagramme de sequence global - Boutique PCJ',
        ['Client', 'Navigateur', 'Laravel', 'BaseDeDonnees'],
        slug='global',
    )
    d.msg(0, 1, 'GET / (accueil, collection)')
    d.msg(1, 2, 'ProductController::index / welcome')
    d.msg(2, 3, 'SELECT products, categories')
    d.ret(3, 2, 'donnees')
    d.ret(2, 1, 'Inertia JSON + page React')
    d.ret(1, 0, 'Affiche vitrine')

    d.msg(0, 1, 'POST /customer/cart/items')
    d.msg(1, 2, 'CartController::store')
    d.msg(2, 2, 'CartService::add (session)')
    d.ret(2, 1, 'ok')
    d.ret(1, 0, 'Panier mis a jour')

    d.msg(0, 1, 'GET /customer/checkout')
    d.msg(1, 2, 'CheckoutController::create')
    d.ret(2, 1, 'formulaire livraison / paiement')
    d.ret(1, 0, 'Affiche checkout')

    d.msg(0, 1, 'POST /customer/checkout [auth client]')
    d.msg(1, 2, 'CheckoutController::store')
    d.msg(2, 2, 'OrderService::createOrder')
    d.msg(2, 3, 'INSERT orders, order_items, UPDATE stock')
    d.ret(3, 2, 'commande PENDING')
    d.ret(2, 1, 'redirect orders.show')
    d.ret(1, 0, 'Confirmation commande')

    d.msg(0, 1, 'GET /admin/products/create [auth admin]')
    d.msg(1, 2, 'ProductController::store')
    d.msg(2, 3, 'INSERT product, variants, notification')
    d.ret(3, 2, 'ok')
    d.ret(2, 1, 'redirect admin.products')
    d.ret(1, 0, 'Produit cree')
    return d


def login_diagram() -> SequenceDiagram:
    d = SequenceDiagram(
        '02 - Connexion',
        'Sequence : connexion client (email ou Google)',
        ['Client', 'Navigateur', 'Laravel', 'BaseDeDonnees', 'Google'],
        slug='connexion',
    )
    d.msg(0, 1, 'GET /auth/login')
    d.ret(1, 0, 'Formulaire connexion')

    d.msg(0, 1, 'POST /login (email, password)')
    d.msg(1, 2, 'Fortify AuthenticatedSessionController')
    d.msg(2, 3, 'SELECT user WHERE email')
    d.ret(3, 2, 'User')
    d.msg(2, 2, 'auth()->login(), session regenerate')
    d.ret(2, 1, 'redirect home / admin')
    d.ret(1, 0, 'Connecte')

    d.msg(0, 1, 'GET /auth/google/redirect')
    d.msg(1, 2, 'GoogleAuthController::redirect')
    d.msg(2, 4, 'OAuth authorize', 'async')
    d.ret(4, 0, 'Consentement Google')

    d.msg(0, 1, 'GET /auth/google/callback?code=')
    d.msg(1, 2, 'GoogleAuthController::callback')
    d.msg(2, 4, 'POST token + GET userinfo')
    d.ret(4, 2, 'email, name')
    d.msg(2, 3, 'CREATE/UPDATE user + customer')
    d.msg(2, 2, 'auth()->login()')
    d.ret(2, 1, 'redirect home')
    d.ret(1, 0, 'Connecte via Google')
    return d


def cart_diagram() -> SequenceDiagram:
    d = SequenceDiagram(
        '03 - Panier',
        'Sequence : ajouter un produit au panier',
        ['Client', 'Navigateur', 'CartController', 'CartService', 'BaseDeDonnees'],
        slug='panier',
    )
    d.msg(0, 1, 'Choisit variante + quantite sur fiche produit')
    d.msg(0, 1, 'POST /customer/cart/items {product_id, variant_id, quantity}')
    d.msg(1, 2, 'store(StoreCartItemRequest)')
    d.msg(2, 2, 'valide champs (FormRequest)')
    d.msg(2, 4, 'SELECT products WHERE id (findOrFail)')
    d.ret(4, 2, 'Product')
    d.msg(2, 4, 'SELECT product_variants WHERE id')
    d.ret(4, 2, 'ProductVariant')
    d.msg(2, 2, 'verifie statut, variante, stock disponible')
    d.msg(2, 3, 'quantityForLine(productId, variantId)')
    d.ret(3, 2, 'quantite deja au panier (session)')
    d.msg(2, 2, 'verifie quantite totale <= stock')
    d.msg(2, 3, 'add(productId, qty, variantId)')
    d.msg(3, 3, 'Session::put(cart.items)')
    d.ret(3, 2, 'ok')
    d.ret(2, 1, 'redirect back + flash success')
    d.ret(1, 0, 'Produit ajoute au panier')
    return d


def checkout_diagram() -> SequenceDiagram:
    d = SequenceDiagram(
        '04 - Commande',
        'Sequence : passer une commande (checkout)',
        ['Client', 'Navigateur', 'CheckoutController', 'OrderService', 'BaseDeDonnees'],
        slug='commande',
    )
    d.msg(0, 1, 'Remplit livraison + paiement')
    d.msg(0, 1, 'POST /customer/checkout [auth + verified]')
    d.msg(1, 2, 'store(StoreCheckoutRequest)')
    d.msg(2, 2, 'reconcile panier, groupe par vendor_id')
    d.msg(2, 2, 'verifie stock pour chaque ligne')
    d.msg(2, 3, 'createOrder(customer, OrderData)')
    d.msg(3, 4, 'BEGIN TRANSACTION')
    d.msg(3, 4, 'INSERT order')
    d.msg(3, 4, 'INSERT order_items')
    d.msg(3, 4, 'UPDATE products.stock (decrement)')
    d.msg(3, 4, 'COMMIT')
    d.ret(4, 3, 'Order status=PENDING')
    d.ret(3, 2, 'order')
    d.msg(2, 2, 'cartService::clear()')
    d.ret(2, 1, 'redirect customer.orders.show')
    d.ret(1, 0, 'Page confirmation commande')
    return d


def favorites_diagram() -> SequenceDiagram:
    d = SequenceDiagram(
        '05 - Favoris',
        'Sequence : ajouter / consulter les favoris',
        ['Client', 'Navigateur', 'FavoriteController', 'BaseDeDonnees'],
        slug='favoris',
    )
    d.msg(0, 1, 'Clic coeur sur produit')
    d.msg(0, 1, 'POST /customer/favorites/{product} [auth]')
    d.msg(1, 2, 'store(Product)')
    d.msg(2, 3, 'syncWithoutDetaching product_favorites')
    d.ret(3, 2, 'ok')
    d.ret(2, 1, 'redirect back')
    d.ret(1, 0, 'Ajoute aux favoris')

    d.msg(0, 1, 'Ouvre tiroir favoris')
    d.msg(0, 1, 'GET /customer/favorites/preview')
    d.msg(1, 2, 'preview()')
    d.msg(2, 3, 'SELECT favorite products')
    d.ret(3, 2, 'products + count')
    d.ret(2, 1, 'JSON')
    d.ret(1, 0, 'Affiche liste favoris')
    return d


def review_diagram() -> SequenceDiagram:
    d = SequenceDiagram(
        '06 - Avis produit',
        'Sequence : publier un avis produit',
        ['Client', 'Navigateur', 'ProductReviewController', 'BaseDeDonnees'],
        slug='avis-produit',
    )
    d.msg(0, 1, 'Soumet note + commentaire')
    d.msg(0, 1, 'POST /customer/products/{id}/reviews [auth]')
    d.msg(1, 2, 'store(StoreProductReviewRequest)')
    d.msg(2, 2, 'verifie produit != DISCONTINUED')
    d.msg(2, 3, 'EXISTS order_items + orders (PAID/PENDING)')
    d.ret(3, 2, 'true / false')
    d.msg(2, 3, 'updateOrCreate product_reviews')
    d.ret(3, 2, 'ProductReview')
    d.ret(2, 1, 'redirect back + success')
    d.ret(1, 0, 'Avis enregistre')
    return d


def notifications_diagram() -> SequenceDiagram:
    d = SequenceDiagram(
        '07 - Notifications',
        'Sequence : notifications nouveaux produits',
        ['Client', 'Navigateur', 'NotificationController', 'CustomerNotificationService', 'BaseDeDonnees'],
        slug='notifications',
    )
    d.msg(0, 1, 'Clic cloche header')
    d.msg(0, 1, 'GET /customer/notifications/preview')
    d.msg(1, 2, 'preview()')
    d.msg(2, 3, 'previewFor(customer?)')
    d.msg(3, 4, 'SELECT store_notifications + products')
    d.ret(4, 3, 'liste notifications')
    d.ret(3, 2, 'JSON notifications + unread_count')
    d.ret(2, 1, '200 OK')
    d.ret(1, 0, 'Affiche tiroir')

    d.msg(0, 1, '[si client connecte]')
    d.msg(1, 2, 'POST /customer/notifications/read-all')
    d.msg(2, 3, 'markAllRead(customer)')
    d.msg(3, 4, 'INSERT customer_notification_reads')
    d.ret(4, 3, 'ok')
    d.ret(3, 2, 'unread_count=0')
    d.ret(2, 1, 'JSON')
    d.ret(1, 0, 'Badge mis a jour')
    return d


def admin_product_diagram() -> SequenceDiagram:
    d = SequenceDiagram(
        '08 - Admin produit',
        'Sequence : admin cree un produit + notification clients',
        ['Admin', 'Navigateur', 'ProductController', 'ProductService', 'CustomerNotificationService', 'BaseDeDonnees'],
        slug='admin-produit',
    )
    d.msg(0, 1, 'Soumet formulaire produit')
    d.msg(0, 1, 'POST /admin/products [auth admin]')
    d.msg(1, 2, 'store(CreateProductRequest)')
    d.msg(2, 2, 'authorize(create, Product)')
    d.msg(2, 3, 'createProduct(vendor, data, image)')
    d.msg(3, 4, 'INSERT products')
    d.ret(4, 3, 'Product')
    d.msg(2, 3, 'syncVariants(product, rows)')
    d.msg(3, 4, 'INSERT/UPDATE product_variants')
    d.msg(2, 5, 'notifyNewProduct(product)')
    d.msg(5, 4, 'INSERT store_notifications')
    d.ret(4, 5, 'ok')
    d.ret(5, 2, 'ok')
    d.ret(3, 2, 'Product')
    d.ret(2, 1, 'redirect admin.products.index')
    d.ret(1, 0, 'Produit cree')
    return d


def write_mxfile(path: Path, diagrams: list[SequenceDiagram]) -> None:
    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<mxfile host="app.diagrams.net" modified="2026-06-19T00:00:00.000Z" '
        'agent="Boutique PCJ" version="22.1.0" type="device">',
    ]
    for diagram in diagrams:
        parts.append(build_diagram_xml(diagram))
    parts.append('</mxfile>')
    content = '\n'.join(parts) + '\n'
    path.write_text(content, encoding='utf-8')
    ET.parse(path)


def main() -> None:
    diagrams = [
        global_diagram(),
        login_diagram(),
        cart_diagram(),
        checkout_diagram(),
        favorites_diagram(),
        review_diagram(),
        notifications_diagram(),
        admin_product_diagram(),
    ]

    write_mxfile(OUT, diagrams)
    print(f'OK: {OUT} ({len(diagrams)} pages)')

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for diagram in diagrams:
        slug = diagram.slug or diagram.name.lower().replace(' ', '-')
        path = OUT_DIR / f'diagramme-sequence-{slug}.drawio'
        write_mxfile(path, [diagram])
        print(f'OK: {path}')


if __name__ == '__main__':
    main()
