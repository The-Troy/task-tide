export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-primary">Privacy Policy</h1>
      <p className="text-muted-foreground mb-6">
        Your privacy is important to us. This Privacy Policy explains how
        TaskTide collects, uses, and protects your personal information when you
        use our platform.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <p className="text-muted-foreground">
          We collect information that you provide directly, such as your name,
          email address, and any documents or notes you upload. We also collect
          basic usage data (like pages visited) to improve the platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Data</h2>
        <p className="text-muted-foreground">
          Your data is used to provide core features such as document access,
          reminders, and group collaboration. We may also use anonymized data
          for analytics to improve user experience.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Sharing of Information</h2>
        <p className="text-muted-foreground">
          We do not sell or rent your personal information. Shared documents are
          only visible to users you choose to share them with (e.g., group
          members).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Cookies & Tracking</h2>
        <p className="text-muted-foreground">
          TaskTide uses cookies to remember your preferences and improve
          performance. You can disable cookies in your browser settings, but
          some features may not work correctly.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
        <p className="text-muted-foreground">
          We take reasonable steps to protect your information from unauthorized
          access, alteration, or loss. However, no system can be 100% secure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
        <p className="text-muted-foreground">
          You may request to view, update, or delete your personal data at any
          time. Contact us through our{" "}
          <a href="/contact" className="underline hover:text-primary">
            contact page
          </a>{" "}
          for assistance.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Changes to This Policy</h2>
        <p className="text-muted-foreground">
          We may update this Privacy Policy from time to time. If we make
          significant changes, we will notify you through the platform or by
          email.
        </p>
      </section>

      <p className="text-muted-foreground mt-8">
        If you have questions about our Privacy Policy, please{" "}
        <a href="/contact" className="underline hover:text-primary">
          contact us
        </a>
        .
      </p>
    </main>
  );
}
