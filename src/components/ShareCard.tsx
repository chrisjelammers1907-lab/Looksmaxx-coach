import { useEffect, useState } from "react";
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
  const [blob, setBlob] = useState<Blob | null>(null);
  const [failed, setFailed] = useState(false);
  const { title, subtitle, image, kind } = card;
  // Render ahead of the tap: Safari only opens the share sheet when share()
  // is called straight from the click, not after the card has been drawn.
  useEffect(() => {
    let live = true;
    setBlob(null);
    setFailed(false);
    renderShareCard({ title, subtitle, image, kind })
      .then((next) => live && setBlob(next))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [title, subtitle, image, kind]);
  return (
    <Button
      type="button"
      variant={variant}
      disabled={!blob && !failed}
      aria-busy={!blob && !failed}
      onClick={() => {
        if (!blob) {
          toast("The card could not be made. Try again.");
          return;
        }
        void shareOrDownload(blob, shareFileName(title)).then((result) => {
          if (result === "downloaded")
            toast("Story card saved. Post it to Instagram or TikTok.");
        });
      }}
    >
      <ImageDown size={15} />
      {label}
    </Button>
  );
}
