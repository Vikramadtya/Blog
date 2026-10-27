export default function AdminTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="mb-6 flex space-x-1 rounded-xl bg-muted/50 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            activeTab === tab.id
              ? "bg-background text-foreground shadow"
              : "text-muted-foreground hover:bg-background/50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
