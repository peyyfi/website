import Image from "next/image";

export function WalletPreview() {
  return (
    <figure className="wallet-preview" aria-label="Peyyfi wallet and virtual card concept preview">
      <div className="wallet-scene" aria-hidden="true">
        <div className="wallet-panel">
          <div className="wallet-panel-header">
            <span className="wallet-brand"><Image src="/peyyfi-mark-reverse.svg" alt="" width={23} height={23} />Peyyfi</span>
            <span className="wallet-status"><span />Your wallet</span>
          </div>
          <div className="wallet-balance">
            <div className="wallet-balance-label">
              <span>Total balance</span>
              <div className="wallet-stablecoins">
                <span><Image src="/icons/usdc.svg" alt="" width={19} height={19} />USDC</span>
                <span><Image src="/icons/usdt.svg" alt="" width={19} height={19} />USDT</span>
              </div>
            </div>
            <p>$3,200<span>.00</span></p>
          </div>
        </div>
        <div className="preview-card">
          <div className="preview-card-top"><Image src="/peyyfi-mark-reverse.svg" alt="" width={30} height={30} /><span>Virtual card</span></div>
          <div className="preview-card-chip"><svg viewBox="0 0 32 26" fill="none"><rect x="1" y="1" width="30" height="24" rx="5" /><path d="M11 1v24M21 1v24M1 9h10m10 0h10M1 17h10m10 0h10M11 13h10" /></svg><svg className="preview-contactless" viewBox="0 0 20 24" fill="none"><path d="M5 9a5 5 0 0 1 0 6m4-10a11 11 0 0 1 0 14M13 1a17 17 0 0 1 0 22" /></svg></div>
          <div className="preview-card-bottom"><span>•••• &nbsp; 4568</span><span className="preview-card-wordmark">peyyfi</span></div>
        </div>
      </div>
      <figcaption className="wallet-preview-caption">
        <div className="stablecoin-backing">
          <span className="stablecoin-logos" aria-hidden="true"><Image src="/icons/usdc.svg" alt="" width={25} height={25} /><Image src="/icons/usdt.svg" alt="" width={25} height={25} /></span>
          <span>Built for <strong>USDC</strong> &amp; <strong>USDT</strong></span>
        </div>
        <p className="preview-disclaimer">Product preview · Illustrative balances</p>
      </figcaption>
    </figure>
  );
}
