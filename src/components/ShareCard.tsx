import { useState } from "react";
import { ImageDown } from "lucide-react";
import { useDemo } from "../lib/store";
import {
  renderShareCard,
  shareFileName,
  shareOrDownload,
  type ShareCardOptions,
} from "../lib/shareCard";
import { Button } from "./ui";

/** Turns a post, outfit or PR into a story card for Instagram or TikTok. */
export default function ShareCardButton({
  card,
  label = "Share to Instagram / TikTok",
  variant = "secondary",
}: {
  card: ShareCardOptions;
  label?: string;
  variant?: string;
}) {
  const { toast } = useDemo();
  const [busy, setBusy] = useState(false);
  return (
    <Button
      type="button"
      variant={variant}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const blob = await renderShareCard(card);
          const result = await shareOrDownload(blob, shareFileName(card.title));
          if (result === "downloaded")
            toast("Story card saved. Post it to Instagram or TikTok.");
        } catch {
          toast("The card could not be made. Try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <ImageDown size={15} />
      {label}
    </Button>
  );
}
