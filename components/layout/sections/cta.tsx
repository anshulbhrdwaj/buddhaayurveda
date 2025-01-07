import DiscordIcon from "@/components/icons/discord-icon";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cta } from "@/lib/landingData";
import { ShoppingBag } from "lucide-react";

export const CTASection = () => {
	return (
		<section id="cta" className="py-12 ">
			<hr className="border-secondary" />
			<div className="container py-20 sm:py-20">
				<div className="lg:w-[60%] mx-auto">
					<Card className="bg-background border-none shadow-none text-center flex flex-col items-center justify-center">
						<CardHeader>
							<CardTitle className="text-4xl md:text-5xl font-bold flex flex-col items-center">
								{/* <DiscordIcon /> */}
								<ShoppingBag className="w-32 h-32 mb-6 bg-gradient-to-r from-white to-primary bg-clip-text"/>
								<div>
									{cta.title.text}
									<span className="text-transparent pl-2 bg-gradient-to-r from-white to-primary bg-clip-text">
										{cta.title.word}
									</span>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className="lg:w-[80%] text-xl text-muted-foreground">
							{cta.subtitle}
						</CardContent>

						<CardFooter>
							<Button asChild>
								<a href={cta.button.link} target="_blank">
									{cta.button.text}
								</a>
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
			<hr className="border-secondary" />
		</section>
	);
};
