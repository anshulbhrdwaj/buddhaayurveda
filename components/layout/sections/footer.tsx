import { Separator } from "@/components/ui/separator";
import { company } from "@/lib/landingData";
import { ChevronsDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const FooterSection = () => {
	return (
		<footer id="footer" className="container py-24 sm:py-32">
			<div className="p-10 bg-card border border-secondary rounded-2xl">
				<div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
					<div className="col-span-full xl:col-span-2">
						<Link href="/" className="flex font-bold items-center">
							<Image src={company.logo} alt={company.name} width={40} height={40} className="w-9 h-9 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary" />

							<h3 className="text-2xl">{company.name}</h3>
						</Link>
					</div>

					<div className="flex flex-col gap-2">
						<h3 className="font-bold text-lg">Contact</h3>
						<div>
							<Link
								href={company.facebook}
								className="opacity-60 hover:opacity-100"
							>
								Facebook
							</Link>
						</div>

						<div>
							<Link
								href={company.whatsapp}
								className="opacity-60 hover:opacity-100"
							>
								WhatsApp
							</Link>
						</div>

						<div>
							<Link
								href={company.instagram}
								className="opacity-60 hover:opacity-100"
							>
								Instagram
							</Link>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<h3 className="font-bold text-lg">Pages</h3>
						<div>
							<Link href="/" className="opacity-60 hover:opacity-100">
								Home
							</Link>
						</div>

						<div>
							<Link href="/store" className="opacity-60 hover:opacity-100">
								Store
							</Link>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<h3 className="font-bold text-lg">Help</h3>
						<div>
							<Link href="#contact" className="opacity-60 hover:opacity-100">
								Contact Us
							</Link>
						</div>

						<div>
							<Link href="#faq" className="opacity-60 hover:opacity-100">
								FAQ
							</Link>
						</div>

						<div>
							<Link href="#contact" className="opacity-60 hover:opacity-100">
								Feedback
							</Link>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<h3 className="font-bold text-lg">Socials</h3>
						<div>
							<Link
								href={company.facebook}
								className="opacity-60 hover:opacity-100"
							>
								Facebook
							</Link>
						</div>

						<div>
							<Link
								href={company.whatsapp}
								className="opacity-60 hover:opacity-100"
							>
								WhatsApp
							</Link>
						</div>

						<div>
							<Link
								href={company.instagram}
								className="opacity-60 hover:opacity-100"
							>
								Instagram
							</Link>
						</div>
					</div>
				</div>

				<Separator className="my-6" />
				<section className="">
					<h3 className="">
						&copy; 2024 Designed and developed by
						<Link
							target="_blank"
							href="https://github.com/anshulbhrdwaj"
							className="text-primary transition-all border-primary hover:border-b-2 ml-1"
						>
							Anshul Bhardwaj
						</Link>
					</h3>
				</section>
			</div>
		</footer>
	);
};
