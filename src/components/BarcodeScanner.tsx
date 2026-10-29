import { useEffect, useRef, useState } from "react";
import { Button, Field } from "./ui";

interface Detector {
  detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]>;
}
declare global {
  interface Window {
    BarcodeDetector?: new (options: { formats: string[] }) => Detector;
  }
}

const formats = ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"];
const validCode = (code: string) => /^\d{6,14}$/.test(code.trim());

/**
 * Reads a product barcode with the camera (the browser's BarcodeDetector, or
 * ZXing on Safari and Firefox) and always offers typing the number instead.
 */
export default function BarcodeScanner({
  onCode,
  busy,
}: {
  onCode: (code: string) => void;
  busy?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const done = useRef(onCode);
  const [status, setStatus] = useState<"starting" | "scanning" | "off">(
    "starting",
  );
  const [typed, setTyped] = useState("");
  useEffect(() => {
    done.current = onCode;
  }, [onCode]);
  useEffect(() => {
    let stopped = false;
    let stream: MediaStream | undefined;
    let timer: number | undefined;
    let zxingStop: (() => void) | undefined;
    const found = (code: string) => {
      if (stopped || !validCode(code)) return;
      stopped = true;
      done.current(code.trim());
    };
    (async () => {
      const node = video.current;
      if (!node || !navigator.mediaDevices?.getUserMedia) {
        setStatus("off");
        return;
      }
      try {
        if (window.BarcodeDetector) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false,
          });
          if (stopped) return;
          node.srcObject = stream;
          await node.play();
          setStatus("scanning");
          const detector = new window.BarcodeDetector({ formats });
          const tick = async () => {
            if (stopped) return;
            try {
              const [hit] = await detector.detect(node);
              if (hit) return found(hit.rawValue);
            } catch {
              /* The next frame may read. */
            }
            timer = window.setTimeout(tick, 250);
          };
          tick();
        } else {
          const { BrowserMultiFormatReader } = await import("@zxing/browser");
          if (stopped) return;
          const controls =
            await new BrowserMultiFormatReader().decodeFromConstraints(
              { video: { facingMode: "environment" }, audio: false },
              node,
              (result) => result && found(result.getText()),
            );
          zxingStop = () => controls.stop();
          if (stopped) zxingStop();
          else setStatus("scanning");
        }
      } catch {
        if (!stopped) setStatus("off");
      }
    })();
    return () => {
      stopped = true;
      window.clearTimeout(timer);
      zxingStop?.();
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);
  return (
    <div className="scanner">
      <div className={`scanner-view ${status}`}>
        <video ref={video} muted playsInline aria-label="Camera preview" />
        {status === "scanning" && <span className="scanner-frame" />}
        {status !== "scanning" && (
          <p>
            {status === "starting"
              ? "Starting the camera…"
              : "The camera isn’t available here. Type the barcode number below."}
          </p>
        )}
      </div>
      <form
        className="scanner-manual"
        onSubmit={(e) => {
          e.preventDefault();
          if (validCode(typed)) onCode(typed.trim());
        }}
      >
        <Field
          label="Barcode number"
          inputMode="numeric"
          pattern="\d{6,14}"
          title="6 to 14 digits"
          value={typed}
          onChange={(e) => setTyped(e.target.value.replace(/\D/g, ""))}
        />
        <Button type="submit" disabled={busy || !validCode(typed)}>
          {busy ? "Looking up…" : "Look up"}
        </Button>
      </form>
      <p className="small-text muted">
        Product values come from Open Food Facts, a free public database. Check
        them against the label.
      </p>
    </div>
  );
}
