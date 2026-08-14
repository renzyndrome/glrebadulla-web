// Wires every [data-copy-email] button on the page. The visual state lives in
// the data-copied attribute so CSS owns the animation (see .swap in global.css);
// this only flips the attribute and announces the result to screen readers.

const RESET_MS = 1800;

function announce(message: string): void {
  const status = document.getElementById('copy-status');
  if (status) status.textContent = message;
}

function wire(): void {
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-copy-email]')
  );
  let timer: number | undefined;

  for (const button of buttons) {
    button.addEventListener('click', async () => {
      const email = button.dataset.copyEmail;
      if (!email) return;

      try {
        await navigator.clipboard.writeText(email);
      } catch {
        // Clipboard can reject on an insecure origin or a denied permission.
        // The mailto link next to the button is the fallback path, so failing
        // silently here is better than a thrown error in the console.
        announce('Copy failed. Use the email link instead.');
        return;
      }

      for (const other of buttons) other.dataset.copied = 'false';
      button.dataset.copied = 'true';
      announce(`${email} copied to clipboard`);

      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        button.dataset.copied = 'false';
        announce('');
      }, RESET_MS);
    });
  }
}

wire();
