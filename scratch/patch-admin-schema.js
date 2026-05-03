const fs = require('fs');
const path = require('path');

const filePath = path.resolve('app/admin/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Import Layers icon
content = content.replace(
  `import { Database, ShieldAlert, LayoutDashboard, Film, Skull, Trash2, Settings, Loader2 } from "lucide-react";`,
  `import { Database, ShieldAlert, LayoutDashboard, Film, Skull, Trash2, Settings, Loader2, Layers } from "lucide-react";`
);

// 2. Import SchemaFieldDesigner (after the X, Save, Edit3 line)
if (!content.includes('SchemaFieldDesigner')) {
  content = content.replace(
    `import { X, Save, Edit3 } from "lucide-react";`,
    `import { X, Save, Edit3 } from "lucide-react";\nimport { SchemaFieldDesigner } from "@/components/admin/schema-field-designer";`
  );
}

// 3. activeTab type - add 'schema'
content = content.replace(
  `useState<'dashboard' | 'scripts' | 'prompts'>('dashboard')`,
  `useState<'dashboard' | 'scripts' | 'prompts' | 'schema'>('dashboard')`
);

// 4. Add Schema tab button in sidebar nav (after prompts button)
const promptsBtn = `              <button onClick={() => setActiveTab('prompts')} className={tabClass('prompts')}>
                <Settings size={16} /><span>Models & Prompts</span>
              </button>`;
const schemaBtn = `              <button onClick={() => setActiveTab('schema')} className={tabClass('schema')}>
                <Layers size={16} /><span>Schema Fields</span>
              </button>`;

if (!content.includes("setActiveTab('schema')")) {
  content = content.replace(promptsBtn, promptsBtn + '\n' + schemaBtn);
}

// 5. Add Schema tab panel (before closing </AnimatePresence>)
const schemaPanel = `
            {/* SCHEMA FIELDS TAB */}
            {activeTab === 'schema' && settings && (
              <motion.div key="schema" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SchemaFieldDesigner initialFields={settings.schema_fields || {}} />
              </motion.div>
            )}
`;

// Insert before the closing </AnimatePresence>
if (!content.includes('SchemaFieldDesigner initialFields')) {
  content = content.replace(
    `          </AnimatePresence>
        </section>`,
    schemaPanel + `          </AnimatePresence>
        </section>`
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Admin page patched successfully');
console.log('- Schema tab button added:', content.includes("setActiveTab('schema')"));
console.log('- SchemaFieldDesigner imported:', content.includes('SchemaFieldDesigner'));
console.log('- Schema tab panel added:', content.includes('SchemaFieldDesigner initialFields'));
