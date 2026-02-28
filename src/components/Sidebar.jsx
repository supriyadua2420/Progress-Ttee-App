export default function Sidebar({
  projects,
  onCreateProject,
  onSelectProject,
  activeProjectId,
  isOpen,
}) {
  return (
    <div
      className={`
        bg-white
        border-r
        border-gray-200
        flex
        flex-col
        transition-all
        duration-300
        ${isOpen ? "w-64 p-4" : "w-0 overflow-hidden"}
      `}
    >
      {isOpen && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Projects
          </h2>

          <button
            onClick={onCreateProject}
            className="flex items-center justify-center bg-blue-500 text-white rounded-full w-10 h-10 mb-4 hover:bg-blue-600 transition"
          >
            +
          </button>

          <div className="space-y-2 overflow-y-auto">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  activeProjectId === project.id
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {project.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}