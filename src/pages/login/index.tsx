import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import agent from "../../Agent";
import EyeClosed from "../../assets/eye-closed.svg";
import EyeOpen from "../../assets/eye-open.svg";
import Button from "../../components/Button";

export default function Login(props: {}) {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
    loading: false,
    error: null,
    service: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const _handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.identifier.length || !form.password.length) return;
    setForm((prev) => ({ ...prev, loading: true }));
    try {
      if (form.service.length) {
        if (!form.service.startsWith("https://")) {
          // @ts-ignore
          setForm((prev) => ({ ...prev, error: "Service Url is not valid" }));
          return;
        }
        // @ts-ignore
        agent.changeService(form.service);
      }

      const result = await agent.login({
        identifier: form.identifier.includes(".")
          ? form.identifier
          : `${form.identifier}.bsky.social`,
        password: form.password,
      });
      if (result.success) {
        navigate("/");
      }
    } catch (err: any) {
      console.error(err.message);
      setForm((prev) => ({ ...prev, error: err.message, loading: false }));
    }
  };

  return (
    <div className="login-container">
      <div className="login-page">
        <div className="login-page__left">
          <h1>Teal</h1>
          <h2>BlueSky Client Powered by SpruceKit</h2>
          <form onSubmit={_handleSubmit}>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Identifier ( ex: me.bsky.social )"
                value={form.identifier}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, identifier: e.target.value }))
                }
              />
            </div>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
              />
              <img
                src={showPassword ? EyeOpen : EyeClosed}
                alt="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <Button text="Login" className="btn" loading={form.loading} />
            {form.error ? <p className="error text-center">{form.error}</p> : ""}
            <p style={{ textAlign: "center" }}>
              Teal requires an existing <a href="https://blueskyweb.xyz/">Bluesky</a> account
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
