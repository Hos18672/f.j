const supabaseUrl = 'https://slrqlhgljoryjaflmbvs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNscnFsaGdsam9yeWphZmxtYnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MjM1NTQsImV4cCI6MjA1NjM5OTU1NH0.y7dSvUMQJR8RM00I3x2TR3J_dHVgXUuMXSE2bz_k-iw';

// Get createClient from the global supabase object
const { createClient } = supabase;

// Initialize Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseKey);

let currentLang = 'de';

async function loadContent() {
    // Load page content
    const { data: contentData } = await supabaseClient 
        .from('translations')
        .select('*');
    
    contentData.forEach(item => {
        const elements = document.querySelectorAll(`[data-content="${item.element_key}"]`);
        elements.forEach(element => {
            element.textContent = item[currentLang];
        });
    });
}

// Initial load
document.addEventListener('DOMContentLoaded', async () => {
    await loadContent();
    loadDynamicLists(); // Additional function for lists
});
async function loadDynamicLists() {
  // Load Skills
  const { data: skillsData } = await supabaseClient 
      .from('skills')
      .select('*')
      .order('id', { ascending: true });

      if (skillsData) {
        // Group by category to clear each container only once
        const categories = new Set(skillsData.map(skill => skill.category));
        
        categories.forEach(category => {
            const container = document.querySelector(`[data-category="${category}"] ul`);
            if (container) {
                container.innerHTML = ''; // Clear old items
            }
        });
    
        // Append new items
        skillsData.forEach(skill => {
            const container = document.querySelector(`[data-category="${skill.category}"] ul`);
            if (container) {
                const li = document.createElement('li');
                li.textContent = skill[currentLang];
                container.appendChild(li);
            }
        });
    }

  // Load Weiterbildungen
  const { data: trainingData } = await supabaseClient 
      .from('educations')
      .select('*')
      .order('id', { ascending: false });

  const trainingContainer = document.querySelector('.weiterbildung-container');
  if(trainingContainer){
    trainingContainer.innerHTML = '';
  
    trainingData.forEach(training => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>${ training[`date_${currentLang}`]}</div>
            <p>${training[`description_${currentLang}`]}</p>
        `;
        trainingContainer.appendChild(li);
    });
  }

}
