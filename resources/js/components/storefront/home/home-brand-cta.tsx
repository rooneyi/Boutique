import { Link } from '@inertiajs/react';
import { HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';
import { SF_PILL_BTN_DARK } from '@/lib/storefront-ui-styles';

export function HomeBrandCta() {
    return (
        <section className="bg-[#f0f0f0] py-12 lg:px-[100px] lg:py-[100px]">
            <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:px-0">
                <div className="overflow-hidden bg-[#bfbfbf] lg:min-h-[619px]">
                    <img
                        src={HOME_ASSETS.brandCta}
                        alt="Collection PCJ"
                        className="mx-auto h-full max-h-[620px] w-full max-w-md object-cover object-top"
                    />
                </div>

                <div className="flex flex-col gap-6">
                    <h2 className="font-poppins text-[clamp(2.5rem,5vw,6rem)] font-bold leading-[1.1] text-black">
                        I&apos;AM THE
                        <br />
                        BRAND
                    </h2>
                    <p className="max-w-lg font-poppins text-lg text-[#292d32] md:text-xl">
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas
                        porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies,
                        purus lectus malesuada libero.
                    </p>
                    <Link
                        href={route('customer.products.index')}
                        className={`${SF_PILL_BTN_DARK} w-fit`}
                    >
                        DECOUVRIR NOTRE COLLECTION
                    </Link>
                </div>
            </div>
        </section>
    );
}
