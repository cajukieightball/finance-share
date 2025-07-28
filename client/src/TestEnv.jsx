export default function TestEnv() {
  return (
    <div>
      <h2>Environment Variables</h2>
      <p>API_URL: {import.meta.env.VITE_API_URL}</p>
    </div>
  );
}