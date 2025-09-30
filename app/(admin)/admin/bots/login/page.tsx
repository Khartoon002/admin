import NavLayout from "@/components/NavLayout";

export default function BotsLoginPage() {
  return (
    <NavLayout>
      <form action="/admin/bots/login" method="POST" className="g-card max-w-sm mx-auto space-y-3">
        <div className="g-title">Bots Admin Login</div>
        <input className="g-input" name="token" placeholder="Enter token" required />
        <button className="g-btn w-full" type="submit">Enter</button>
      </form>
    </NavLayout>
  );
}
