import { useMemo, useState } from "react";
import {
  createGroupRecord,
  getWeeklyChallenge,
  joinGroup,
  leaveGroup,
  loadGroup,
  markWeeklyMeditation,
  saveGroup
} from "../services/churchGroup";

export default function ChurchGroupCard() {
  const challenge = useMemo(() => getWeeklyChallenge(new Date()), []);
  const [group, setGroup] = useState(() => loadGroup());
  const [nom, setNom] = useState("Groupe de maison");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const done = Boolean(group?.weekDone?.[challenge.id]);

  const onCreate = () => {
    const created = saveGroup(createGroupRecord(nom));
    setGroup(created);
    setMessage(`Code ${created.code} créé. Partage-le à ton groupe : le verset de la semaine est le même pour ce code.`);
  };

  const onJoin = () => {
    const result = joinGroup(code, nom);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    setGroup(result.group);
    setMessage(`Tu marches avec le code ${result.group.code}.`);
  };

  const onDone = () => {
    if (!group) return;
    setGroup(markWeeklyMeditation(group, challenge.id));
  };

  return (
    <div className="group-hero-card">
      <div>
        <span className="pill" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
          GROUPE DE LA SEMAINE
        </span>
        <h3>{group ? group.nom : "Marcher avec un groupe"}</h3>
        <p>
          {group
            ? `Code ${group.code}. Chaque membre médite le même verset, sur son appareil.`
            : "Crée un code ou rejoins celui de ton église, de ta famille ou de ta maison."}
        </p>
      </div>

      <blockquote style={{ margin: "14px 0", fontSize: "15px" }}>
        « {challenge.texte} »
        <small style={{ display: "block", marginTop: "6px" }}>{challenge.ref} · {challenge.theme}</small>
      </blockquote>

      {group ? (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="secondary-button" type="button" onClick={onDone} disabled={done} style={{ background: "#fff", color: "#0756a5", border: "0" }}>
            {done ? "Méditation de la semaine gardée" : "J'ai médité ce verset"}
          </button>
          <button
            className="text-button"
            type="button"
            onClick={() => {
              leaveGroup();
              setGroup(null);
              setMessage("");
            }}
            style={{ color: "#fff" }}
          >
            Quitter le groupe
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "8px" }}>
          <input
            aria-label="Nom du groupe"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            maxLength={40}
            style={{ padding: "10px 12px", borderRadius: "10px", border: "0" }}
          />
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button className="secondary-button" type="button" onClick={onCreate} style={{ background: "#fff", color: "#0756a5", border: "0" }}>
              Créer un code
            </button>
            <input
              aria-label="Code du groupe"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              placeholder="CODE"
              style={{ width: "110px", padding: "10px 12px", borderRadius: "10px", border: "0" }}
            />
            <button className="secondary-button" type="button" onClick={onJoin} style={{ background: "#fff", color: "#0756a5", border: "0" }}>
              Rejoindre
            </button>
          </div>
        </div>
      )}
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}
