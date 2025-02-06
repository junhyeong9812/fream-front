const StyleCard: React.FC<{
  item: { image: string; name: string; likes: number; description: string };
}> = ({ item }) => {
  return (
    <div style={{ width: "calc(25% - 16px)", marginBottom: "16px" }}>
      <img
        src={item.image}
        alt={item.name}
        style={{ width: "100%", borderRadius: "8px" }}
      />
      <h4>{item.name}</h4>
      <p>{item.description}</p>
      <p>❤️ {item.likes}</p>
    </div>
  );
};
