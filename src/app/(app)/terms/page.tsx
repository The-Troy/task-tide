export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-primary">Terms of Service</h1>
      <p className="text-muted-foreground mb-6">
        Welcome to TaskTide! By accessing or using our website and services,
        you agree to the following terms. Please read them carefully before
        using the platform.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground">
          By using TaskTide, you confirm that you are at least 13 years old and
          capable of entering into a legally binding agreement. If you do not
          agree with these terms, you must stop using our platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
        <p className="text-muted-foreground">
          You are responsible for maintaining the confidentiality of your account
          information and all activities that occur under your account. Notify us
          immediately if you suspect unauthorized access.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Acceptable Use</h2>
        <p className="text-muted-foreground">
          You agree not to use TaskTide for illegal activities, spamming, or
          sharing harmful content. We reserve the right to suspend or terminate
          accounts that violate these rules.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Content Ownership</h2>
        <p className="text-muted-foreground">
          Any documents, tasks, or notes you upload remain yours. However, by
          sharing them with groups, you grant other group members permission to
          view and collaborate on them.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
        <p className="text-muted-foreground">
          TaskTide is provided “as-is.” We do not guarantee uninterrupted access
          or error-free service. We are not responsible for any losses caused by
          downtime, data loss, or misuse of the platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Changes to Terms</h2>
        <p className="text-muted-foreground">
          We may update these Terms of Service from time to time. If we make
          significant changes, we will notify users by email or via a notice on
          the platform.
        </p>
      </section>

      <p className="text-muted-foreground mt-8">
        If you have any questions about these terms, please{" "}
        <a href="/contact" className="underline hover:text-primary">
          contact us
        </a>
        .
      </p>
    </main>
  );
}
