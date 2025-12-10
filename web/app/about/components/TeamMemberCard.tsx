import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
}

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = "0 8px 12px rgba(0, 0, 0, 0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    }}>
      <div style={{
        width: "150px",
        height: "150px",
        borderRadius: "16px",
        backgroundColor: "#e2e8f0",
        margin: "0 auto 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}>
        <Image 
          src={member.image} 
          alt={member.name} 
          width={150} 
          height={150}
          style={{ objectFit: "cover" }}
        />
      </div>
      <h4 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#2E5A7F", marginBottom: "0.5rem" }}>
        {member.name}
      </h4>
      <p style={{ fontSize: "0.9rem", color: "#093824", fontWeight: 500, marginBottom: "0.75rem" }}>
        {member.role}
      </p>
      <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: "1.6" }}>
        {member.description}
      </p>
    </div>
  );
}
