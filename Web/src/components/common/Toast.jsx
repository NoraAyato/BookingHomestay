
let toastContainer = null;

// Initialize toast container if not exists
function initToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className =
      "fixed top-16 right-0 z-50 flex flex-col gap-3 w-auto";
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

// Toast types configuration
const toastConfig = {
  success: {
    icon: "fas fa-check-circle",
    bgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
    progressBar: "bg-emerald-200",
    iconColor: "text-white",
  },
  error: {
    icon: "fas fa-exclamation-circle",
    bgColor: "bg-gradient-to-r from-red-500 to-rose-700",
    progressBar: "bg-rose-200",
    iconColor: "text-white",
  },
  warning: {
    icon: "fas fa-exclamation-triangle",
    bgColor: "bg-gradient-to-r from-amber-500 to-orange-600",
    progressBar: "bg-amber-200",
    iconColor: "text-white",
  },
  info: {
    icon: "fas fa-info-circle",
    bgColor: "bg-gradient-to-r from-blue-500 to-indigo-600",
    progressBar: "bg-indigo-200",
    iconColor: "text-white",
  },
  default: {
    icon: "fas fa-bell",
    bgColor: "bg-gradient-to-r from-gray-600 to-gray-700",
    progressBar: "bg-gray-200",
    iconColor: "text-white",
  },
};

export function showToast(type, message, duration = 3000) {
  // Initialize container
  const container = initToastContainer();

  // Create toast element
  const toast = document.createElement("div");
  const config = toastConfig[type] || toastConfig.default;

  toast.className = `relative overflow-hidden rounded-lg shadow-md transform transition-all duration-300 
      opacity-0 translate-x-20 ${config.bgColor} text-white text-xs`;
  toast.style.width = "220px";

  // Toast content
  toast.innerHTML = `
      <div class="flex items-start p-2">
      <div class="flex-shrink-0 pt-0.5">
          <i class="${config.icon} ${config.iconColor} text-xs"></i>
      </div>
      <div class="ml-3 flex-1">
          <p class="text-xs font-medium">${message}</p>
      </div>
        <button class="flex-shrink-0 ml-2 text-white opacity-70 hover:opacity-100 
          transition-opacity focus:outline-none" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times text-xs"></i>
        </button>
    </div>
    <div class="w-full h-1 ${config.progressBar} bg-opacity-50">
      <div class="h-full ${config.progressBar} progress-bar" style="width:100%;transition:width ${duration}ms linear;"></div>
    </div>
  `;

  // Add to container
  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-x-20");
    toast.classList.add("opacity-100");

    // Animate progress bar
    const progressBar = toast.querySelector(".progress-bar");
    if (progressBar) {
      progressBar.style.width = "100%";
      progressBar.style.transition = `width ${duration}ms linear`;
      setTimeout(() => {
        progressBar.style.width = "0%";
      }, 10);
    }
  }, 10);

  // Auto remove after duration
  const removeToast = () => {
    toast.classList.add("opacity-0", "translate-x-20");
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  };

  // Set timeout for auto removal
  const timeoutId = setTimeout(removeToast, duration);

  // Setup click to dismiss
  toast.addEventListener("click", () => {
    clearTimeout(timeoutId);
    removeToast();
  });
}

// Add styles to document head
const style = document.createElement("style");
style.textContent = `
@keyframes toast-slide-in {
  from { 
    opacity: 0;
    transform: translateX(30px);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes toast-slide-out {
  from { 
    opacity: 1;
    transform: translateX(0);
  }
  to { 
    opacity: 0;
    transform: translateX(30px);
  }
}

@keyframes progress-bar {
  from { width: 100%; }
  to { width: 0%; }
}

.toast-progress {
  animation: progress-bar 5s linear forwards;
}
`;
document.head.appendChild(style);

// Export default function for convenience
export default { showToast };
