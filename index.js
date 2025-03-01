const supabaseUrl = "https://slrqlhgljoryjaflmbvs.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscnFsaGdsam9yeWphZmxtYnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MjM1NTQsImV4cCI6MjA1NjM5OTU1NH0.y7dSvUMQJR8RM00I3x2TR3J_dHVgXUuMXSE2bz_k-iw";

// Get createClient from the global supabase object and initialize the client.
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

let currentLang = "de";

// Update current language from localStorage and set the language switcher value if available.
function updateLang() {
  const language = localStorage.getItem("language");
  if (language) {
    currentLang = language;
    const languageSwitcher1 = document.getElementById("languageSwitcher1");
    const languageSwitcher2 = document.getElementById("languageSwitcher2");
    if (languageSwitcher1) {
      languageSwitcher1.value = currentLang;
    }
    if (languageSwitcher2) {
      languageSwitcher2.value = currentLang;
    }
  }
}

// Load content and UI translations in one query and update both element sets.
async function loadContent() {
  updateLang();

  try {
    const { data: translations, error } = await supabaseClient
      .from("translations")
      .select("*");

    if (error) {
      console.error("Error loading translations:", error);
      return;
    }
    if (Array.isArray(translations)) {
      translations.forEach((item) => {
        // Update elements with data-content attribute.
        document
          .querySelectorAll(`[data-content="${item.element_key}"]`)
          .forEach((el) => {
            el.textContent = item[currentLang];
          });
        // Update elements with data-translate attribute.
        document
          .querySelectorAll(`[data-translate="${item.element_key}"]`)
          .forEach((el) => {
            el.textContent = item[currentLang];
          });
      });
    }
  } catch (err) {
    console.error("Exception in loadContent:", err);
  }

  // Handle RTL layout for all elements with the class "dir_item", excluding those with the "about" class.
  document.querySelectorAll(".dir_item").forEach((section) => {
    if (!section.classList.contains("about")) {
      section.dir = currentLang === "fa" ? "rtl" : "ltr";
    }
  });
}

// Helper to attach language switcher event listener.
function attachLanguageSwitcher(selectorId) {
  const switcher = document.getElementById(selectorId);
  if (switcher) {
    switcher.addEventListener("change", async (e) => {
      currentLang = e.target.value;
      localStorage.setItem("language", currentLang);
      await loadContent();
      await loadDynamicLists();
    });
  }
}

// Initial load and attach event listeners when DOM is ready.
document.addEventListener("DOMContentLoaded", async () => {
  await loadContent();
  await loadDynamicLists();

  attachLanguageSwitcher("languageSwitcher1");
  attachLanguageSwitcher("languageSwitcher2");

  // Hamburger menu toggle functionality.
  const hm = document.querySelector(".hamburger-icon");
  const bars = document.querySelector(".bars");
  document.addEventListener("click", (event) => {
    if (hm && bars) {
      if (
        event.target.classList.contains("nav-item") &&
        !event.target.classList.contains("language-switcher")
      ) {
        event.target.classList.add('active')
        document.querySelectorAll('a').forEach(item => {
          if(item !== event.target){
            item.classList.remove('active')
          }
        })
        hm.classList.toggle("open");
        bars.classList.toggle("open-bars");
      }
      if (event.target.classList.contains("hmBtn")) {
        hm.classList.toggle("open");
        bars.classList.toggle("open-bars");
      }
    }

    if ( event.target.classList.contains("nav-item") ) {
      event.target.classList.add('active')
      document.querySelectorAll('.nav-item a').forEach(item => {
        if(item !== event.target){
          item.classList.remove('active')
        }
      })
    }
  });
});

// Load dynamic list items for Skills and Educations.
async function loadDynamicLists() {
  try {
    // Load Skills data.
    const { data: skillsData, error: skillsError } = await supabaseClient
      .from("skills")
      .select("*")
      .order("id", { ascending: true });

    if (skillsError) {
      console.error("Error loading skills:", skillsError);
    } else if (Array.isArray(skillsData)) {
      // Clear each category container only once.
      const categories = new Set(skillsData.map((skill) => skill.category));
      categories.forEach((category) => {
        const container = document.querySelector(
          `[data-category="${category}"] ul`
        );
        if (container) {
          container.innerHTML = "";
        }
      });

      // Append new skill items.
      skillsData.forEach((skill) => {
        const container = document.querySelector(
          `[data-category="${skill.category}"] ul`
        );
        if (container) {
          const li = document.createElement("li");
          li.textContent = skill[currentLang];
          container.appendChild(li);
        }
      });
    }

    // Load Educations (Weiterbildungen) data.
    const { data: trainingData, error: trainingError } = await supabaseClient
      .from("educations")
      .select("*")
      .order("id", { ascending: false });

    if (trainingError) {
      console.error("Error loading educations:", trainingError);
    } else if (Array.isArray(trainingData)) {
      const trainingContainer = document.querySelector(
        ".weiterbildung-container"
      );
      if (trainingContainer) {
        trainingContainer.innerHTML = "";
        trainingData.forEach((training) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <div>${training[`date_${currentLang}`]}</div>
            <p>${training[`description_${currentLang}`]}</p>
          `;
          trainingContainer.appendChild(li);
        });
      }
    }
  } catch (err) {
    console.error("Exception in loadDynamicLists:", err);
  }
}
