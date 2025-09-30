export async function sendAutoRemote(key: string, name: string, phone: string) {
  const url = `https://autoremotejoaomgcd.appspot.com/sendmessage?key=${encodeURIComponent(key)}&message=${encodeURIComponent(`lead:=:${name}: :+${phone}`)}`;
  try {
    await fetch(url, { method: "GET", cache: "no-store" });
  } catch {}
}
