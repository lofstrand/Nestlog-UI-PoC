
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ChevronRight, 
} from 'lucide-react';
import { View, Household, Property, Space, SpaceType, SpaceSurfaceType, SpaceSurfaceMaterialType, MaintenanceTask, MaintenanceTaskPriority, MaintenanceTaskStatus, Project, ProjectStatus, Tag, InventoryItem, Contact, Document, InventoryCategory, Note, MaintenanceRecurrenceFrequency, InventoryItemStatus, InsurancePolicy, UtilityAccount, ActivityLogEntry, HouseholdMember, HouseholdInvite, SurfaceCondition } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import HouseholdsList from './components/HouseholdsList';
import PropertiesList from './components/PropertiesList';
import SpacesList from './components/SpacesList';
import MaintenanceList from './components/MaintenanceList';
import ProjectsList from './components/ProjectsList';
import TagsList from './components/TagsList';
import InventoryList from './components/InventoryList';
import ContactsList from './components/ContactsList';
import DocumentsList from './components/DocumentsList';
import InventoryCategoriesList from './components/InventoryCategoriesList';
import GroupDashboard from './components/GroupDashboard';
import EntityDetail from './components/EntityDetail';
import AIAdvisor from './components/AIAdvisor';
import ProfilePage from './components/ProfilePage';
import InsuranceList from './components/InsuranceList';
import UtilityList from './components/UtilityList';
import NotificationsArchive from './components/NotificationsArchive';
import ActivityLog from './components/ActivityLog';

// --- SEED DATA: TAGS ---
const MOCK_TAGS: Tag[] = [
  { id: 'tag1', propertyId: 'p1', name: 'ROT-avdrag', description: 'Projects eligible for Swedish tax deduction on labor.', iconName: 'TrendingDown', colorHex: '#5a6b5d', usageCount: 12, notes: [], documentIds: [] },
  { id: 'tag2', propertyId: 'p1', name: 'RUT-avdrag', description: 'Domestic services like cleaning or snow removal.', iconName: 'Sparkles', colorHex: '#1e293b', usageCount: 8, notes: [], documentIds: [] },
  { id: 'tag3', propertyId: 'p1', name: 'Warranty', description: 'Active manufacturer protection.', iconName: 'ShieldCheck', colorHex: '#3a5a40', usageCount: 22, notes: [], documentIds: ['d1', 'd2'] },
  { id: 'tag4', propertyId: 'p1', name: 'Critical', description: 'Items requiring immediate audit or repair.', iconName: 'AlertCircle', colorHex: '#b45c43', usageCount: 5, notes: [], documentIds: [] },
  { id: 'tag5', propertyId: 'p1', name: 'Energy Efficient', description: 'Infrastructure aimed at lowering power burn.', iconName: 'Zap', colorHex: '#a47148', usageCount: 14, notes: [], documentIds: [] },
];

// --- SEED DATA: CATEGORIES ---
const MOCK_CATEGORIES: InventoryCategory[] = [
  { id: 'cat1', propertyId: 'p1', name: 'White Goods', iconName: 'Refrigerator', colorHex: '#1e293b', isInsuranceCritical: true, estimatedDepreciationRate: 10, sortOrder: 1, notes: [], tags: [], documentIds: [] },
  { id: 'cat2', propertyId: 'p1', name: 'Consumer Electronics', iconName: 'Cpu', colorHex: '#2563eb', isInsuranceCritical: true, estimatedDepreciationRate: 20, sortOrder: 2, notes: [], tags: [], documentIds: [] },
  { id: 'cat3', propertyId: 'p1', name: 'Designer Furniture', iconName: 'Armchair', colorHex: '#a47148', isInsuranceCritical: true, estimatedDepreciationRate: 5, sortOrder: 3, notes: [], tags: [], documentIds: [] },
];

// --- SEED DATA: DOCUMENTS ---
const MOCK_DOCUMENTS: Document[] = [
  { 
    id: 'd1', 
    propertyId: 'p1', 
    title: 'Östermalm Penthouse Deed', 
    category: 'Legal Deed', 
    isPrivate: true, 
    attachments: [
      { id: 'att1', fileName: 'deed_archive.pdf', contentType: 'application/pdf', sizeBytes: 5200000, createdAtUtc: '2023-01-15T00:00:00Z' }
    ], 
    notes: [], 
    tags: ['Critical'], 
    inventoryItems: [], 
    createdAtUtc: '2023-01-15T00:00:00Z',
    projectIds: [],
    taskIds: [],
    surfaceIds: []
  },
  { 
    id: 'd2', 
    propertyId: 'p1', 
    title: 'Miele Dishwasher Manual', 
    category: 'User Manual', 
    isPrivate: false, 
    attachments: [
      { id: 'att2', fileName: 'miele_dishwasher_guide.pdf', contentType: 'application/pdf', sizeBytes: 1800000, createdAtUtc: '2023-02-10T00:00:00Z' }
    ], 
    notes: [], 
    tags: ['Warranty'], 
    inventoryItems: [], 
    createdAtUtc: '2023-02-10T00:00:00Z',
    projectIds: [],
    taskIds: [],
    surfaceIds: []
  }
];

// --- SEED DATA: HOUSEHOLDS ---
const MOCK_HOUSEHOLDS: Household[] = [
  { id: 'h1', name: 'Stockholm Portfolio', status: 'Active', description: 'Primary urban residence and surrounding investment units.', propertyCount: 2, lastMaintained: '2024-05-10', currencyCode: 'SEK', notes: [], tags: ['Primary'], documentIds: [] },
  { id: 'h2', name: 'Scandanavian Retreats', status: 'Active', description: 'Leisure properties for seasonal use.', propertyCount: 2, lastMaintained: '2024-03-22', currencyCode: 'SEK', notes: [], tags: ['Vacation'], documentIds: [] }
];

// --- SEED DATA: PROPERTIES ---
const MOCK_PROPERTIES: Property[] = [
  { 
    id: 'p1', 
    name: 'Östermalm Penthouse', 
    isPrimaryResidence: true, 
    isArchived: false, 
    address: { line1: 'Grev Turegatan 12', city: 'Stockholm', stateOrRegion: 'AB', postalCode: '114 46', countryCode: 'SE' }, 
    constructionYear: 1912, 
    floorArea: 145, 
    propertyType: 'Apartment', 
    occupancyStatus: 'OwnerOccupied', 
    energyRating: 'B', 
    heatingSystemType: 'District Heating', 
    roofType: 'Zinc Siding', 
    gallery: [],
    createdAtUtc: '2023-01-15T00:00:00Z', 
    notes: [], 
    tags: ['Urban'], 
    documentIds: [] 
  }
];

// --- SEED DATA: SPACES ---
const MOCK_SPACES: Space[] = [
  { id: 's1', propertyId: 'p1', name: 'Gourmet Kök', spaceType: SpaceType.Kitchen, level: 1, isOutdoor: false, sortOrder: 1, isArchived: false, surfaces: [], gallery: [], createdAtUtc: '2023-01-15T00:00:00Z', updatedAtUtc: '2023-01-15T00:00:00Z', notes: [], tags: [], documentIds: [] },
];

// --- SEED DATA: INVENTORY ---
const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'i1', propertyId: 'p1', spaceId: 's1', name: 'Miele Dishwasher', brand: 'Miele', modelNumber: 'G 7160', category: 'White Goods', status: InventoryItemStatus.Excellent, quantity: 1, unit: 'unit', purchaseDate: '2023-02-15', purchasePrice: 15400, value: 14000, createdAtUtc: new Date().toISOString(), notes: [], tags: ['Warranty'], documentIds: [] },
];

// --- SEED DATA: TASKS ---
const MOCK_TASKS: MaintenanceTask[] = [
  { id: 't1', propertyId: 'p1', title: 'Swap HVAC Filter', dueDateUtc: '2024-06-15T00:00:00Z', priority: MaintenanceTaskPriority.High, status: MaintenanceTaskStatus.Pending, createdAtUtc: new Date().toISOString(), tags: ['Energy Efficient'], notes: [], documentIds: [], spaceIds: ['s1'] },
];

// --- SEED DATA: PROJECTS ---
const MOCK_PROJECTS: Project[] = [
  { id: 'proj1', propertyId: 'p1', title: 'Solar Panel Array', status: ProjectStatus.Active, startDate: '2024-05-01', budget: 185000, actualCost: 95000, gallery: [], createdAtUtc: new Date().toISOString(), tasks: [], notes: [], tags: ['Energy Efficient'], documentIds: [], spaceIds: [] },
];

// --- SEED DATA: CONTACTS ---
const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', propertyId: 'p1', firstName: 'Anders', surname: 'Svensson', company: "Vattenfall EL", category: 'Vendor', email: 'anders@vattenfall.se', phone: '+46 70 123 45 67', isEmergencyContact: true, specialties: ['Electrical'], notes: [], tags: [], documentIds: [] },
  { id: 'c2', propertyId: 'p1', firstName: 'Karin', surname: 'Lundberg', company: "Trygg-Hansa", category: 'Vendor', email: 'karin@th.se', phone: '+46 8 500 222 11', isEmergencyContact: false, specialties: ['Insurance'], notes: [], tags: [], documentIds: [] },
];

// --- SEED DATA: INSURANCE ---
const MOCK_POLICIES: InsurancePolicy[] = [
  { id: 'pol1', propertyId: 'p1', providerId: 'c2', title: 'Stockholm Portfolio Policy', policyNumber: 'FLK-12992-SE', type: 'Homeowners', premium: 450, deductible: 1500, coverageLimit: 12000000, startDate: '2024-01-01', endDate: '2025-01-01', renewalDate: '2025-01-01', notes: [], documentIds: [], tags: [], claims: [] },
  { id: 'pol2', propertyId: 'p1', providerId: 'c2', title: 'Valuables Protection', policyNumber: 'VAL-9921', type: 'Jewelry/Valuables', premium: 120, deductible: 500, coverageLimit: 500000, startDate: '2024-01-01', endDate: '2025-01-01', renewalDate: '2024-11-20', notes: [], documentIds: [], tags: [], claims: [] },
];

// --- SEED DATA: UTILITIES ---
const MOCK_UTILITIES: UtilityAccount[] = [
  { id: 'ut1', propertyId: 'p1', providerId: 'c1', title: 'Penthouse Power', type: 'Electricity', accountNumber: 'STK-EL-9921', averageMonthlyCost: 1850, useCalculatedAverage: false, lastPaymentDate: '2024-04-28', notes: [], tags: [], documentIds: [], invoices: [
    { id: 'inv1', amount: 1920, dueDateUtc: '2024-06-28T00:00:00Z', note: 'June Bill' },
  ] },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [lastView, setLastView] = useState<View | null>(null);
  const [households, setHouseholds] = useState<Household[]>(MOCK_HOUSEHOLDS);
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [spaces, setSpaces] = useState<Space[]>(MOCK_SPACES);
  const [tasks, setTasks] = useState<MaintenanceTask[]>(MOCK_TASKS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tags, setTags] = useState<Tag[]>(MOCK_TAGS);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [inventoryCategories, setInventoryCategories] = useState<InventoryCategory[]>(MOCK_CATEGORIES);
  const [insurance, setInsurance] = useState<InsurancePolicy[]>(MOCK_POLICIES);
  const [utilities, setUtilities] = useState<UtilityAccount[]>(MOCK_UTILITIES);
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<{ type: string, id: string } | null>(null);

  // COMPUTED FINANCE DATA
  const financeOverviewData = useMemo(() => {
    const insuranceLoad = insurance.reduce((acc, p) => acc + p.premium, 0);
    const utilityBurn = utilities.reduce((acc, u) => acc + u.averageMonthlyCost, 0);
    
    const upcomingDeadlines: any[] = [
      ...insurance.map(p => ({
        id: p.id,
        label: p.title,
        type: 'renewal',
        date: p.renewalDate,
        amount: p.premium,
      })),
      ...utilities.flatMap(u => (u.invoices || [])
        .filter(inv => new Date(inv.dueDateUtc) > new Date())
        .map(inv => ({
          id: inv.id,
          label: u.title,
          type: 'payment',
          date: inv.dueDateUtc,
          amount: inv.amount
        })))
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const enrichedDeadlines = upcomingDeadlines.map(d => {
      const diff = new Date(d.date).getTime() - new Date().getTime();
      const days = Math.ceil(diff / (1000 * 3600 * 24));
      let urgency: 'critical' | 'soon' | 'normal' = 'normal';
      if (days < 7) urgency = 'critical';
      else if (days < 14) urgency = 'soon';
      return { ...d, urgency };
    }).slice(0, 5); // LIMIT TO 5 AS REQUESTED

    return {
      totalMonthlyCommitment: insuranceLoad + utilityBurn,
      insuranceLoad,
      utilityBurn,
      upcomingDeadlines: enrichedDeadlines
    };
  }, [insurance, utilities]);

  const stats = {
    households: households.length,
    properties: properties.length,
    spaces: spaces.length,
    maintenance: tasks.length,
    projects: projects.length,
    insurance: insurance.length,
    utilities: utilities.length,
    documents: documents.length,
    contacts: contacts.length,
    inventory: inventory.length,
    inventory_categories: inventoryCategories.length,
    tags: tags.length
  };

  const navigateTo = (view: View) => {
    setLastView(currentView);
    setCurrentView(view);
    if (view !== 'entity_detail') setSelectedEntity(null);
  };

  const handleUpdateEntity = (type: string, id: string, data: any) => {
    const updater = (list: any[]) => list.map(item => item.id === id ? { ...item, ...data } : item);
    switch(type) {
      case 'household': setHouseholds(updater); break;
      case 'property': setProperties(updater); break;
      case 'space': setSpaces(updater); break;
      case 'task': setTasks(updater); break;
      case 'project': setProjects(updater); break;
      case 'inventory': setInventory(updater); break;
      case 'contact': setContacts(updater); break;
      case 'document': setDocuments(updater); break;
      case 'inventory_category': setInventoryCategories(updater); break;
      case 'insurance': setInsurance(updater); break;
      case 'utility': setUtilities(updater); break;
    }
  };

  const handleQuickAddContact = async (data: Partial<Contact>): Promise<string> => {
    const newContact: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId: 'p1',
      firstName: data.firstName || 'New',
      surname: data.surname || 'Contact',
      company: data.company,
      category: data.category || 'Other',
      specialties: data.specialties || [],
      isEmergencyContact: false,
      rating: 5,
      notes: [],
      tags: [],
      documentIds: []
    };
    setContacts(prev => [newContact, ...prev]);
    return newContact.id;
  };

  const findEntity = () => {
    if (!selectedEntity) return null;
    const { type, id } = selectedEntity;
    switch (type) {
      case 'property': return properties.find(p => p.id === id);
      case 'household': return households.find(h => h.id === id);
      case 'space': return spaces.find(s => s.id === id);
      case 'task': return tasks.find(t => t.id === id);
      case 'project': return projects.find(p => p.id === id);
      case 'document': return documents.find(d => d.id === id);
      case 'contact': return contacts.find(c => c.id === id);
      case 'inventory': return inventory.find(i => i.id === id);
      case 'inventory_category': return inventoryCategories.find(c => c.id === id);
      case 'insurance': return insurance.find(p => p.id === id);
      case 'utility': return utilities.find(u => u.id === id);
      case 'tag': return tags.find(t => t.id === id);
      default: return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden blueprint-grid bg-[#fcfcf9]">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={navigateTo} 
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen} 
          toggleAdvisor={() => setAdvisorOpen(!advisorOpen)} 
          setCurrentView={navigateTo}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {currentView === 'overview' && <Dashboard households={households} onNavigate={navigateTo} />}
            {['workspace', 'planner', 'finance', 'library'].includes(currentView) && (
              <GroupDashboard 
                title={currentView} 
                type={currentView as any} 
                onNavigate={navigateTo} 
                stats={stats} 
                financeData={currentView === 'finance' ? financeOverviewData : undefined}
              />
            )}
            
            {/* WORKSPACE VIEWS */}
            {currentView === 'households' && <HouseholdsList households={households} availableTags={tags} onRefresh={() => {}} onView={(id) => { setSelectedEntity({type:'household', id}); navigateTo('entity_detail'); }} onDelete={(id) => setHouseholds(h => h.filter(x => x.id !== id))} />}
            {currentView === 'properties' && <PropertiesList properties={properties} availableTags={tags} onRefresh={() => {}} onView={(id) => { setSelectedEntity({type:'property', id}); navigateTo('entity_detail'); }} onDelete={(id) => setProperties(p => p.filter(x => x.id !== id))} />}
            {currentView === 'spaces' && <SpacesList spaces={spaces} availableTags={tags} availableDocuments={documents} onRefresh={() => {}} onView={(id) => { setSelectedEntity({type:'space', id}); navigateTo('entity_detail'); }} onDelete={(id) => setSpaces(s => s.filter(x => x.id !== id))} />}

            {/* PLANNER VIEWS */}
            {currentView === 'maintenance' && <MaintenanceList tasks={tasks} spaces={spaces} availableTags={tags} availableInventory={inventory} availableContacts={contacts} onRefresh={() => {}} onView={(id) => { setSelectedEntity({type:'task', id}); navigateTo('entity_detail'); }} onDelete={(id) => setTasks(t => t.filter(x => x.id !== id))} />}
            {currentView === 'projects' && <ProjectsList projects={projects} availableTags={tags} availableSpaces={spaces} availableContacts={contacts} onRefresh={() => {}} onView={(id) => { setSelectedEntity({type:'project', id}); navigateTo('entity_detail'); }} onDelete={(id) => setProjects(p => p.filter(x => x.id !== id))} />}

            {/* FINANCE VIEWS */}
            {currentView === 'insurance' && <InsuranceList policies={insurance} contacts={contacts} onView={(id) => { setSelectedEntity({type:'insurance', id}); navigateTo('entity_detail'); }} onDelete={(id) => setInsurance(i => i.filter(x => x.id !== id))} onEdit={() => {}} onSave={(data) => handleUpdateEntity('insurance', data.id!, data)} onQuickAddContact={handleQuickAddContact} />}
            {currentView === 'utilities' && <UtilityList accounts={utilities} contacts={contacts} onView={(id) => { setSelectedEntity({type:'utility', id}); navigateTo('entity_detail'); }} onDelete={(id) => setUtilities(prev => prev.filter(x => x.id !== id))} onQuickAddContact={handleQuickAddContact} onSave={(data) => handleUpdateEntity('utility', data.id!, data)} availableSpaces={spaces} />}

            {/* LIBRARY VIEWS */}
            {currentView === 'documents' && <DocumentsList documents={documents} spaces={spaces} inventory={inventory} projects={projects} tasks={tasks} contacts={contacts} availableTags={tags} onRefresh={() => {}} onView={(id) => { setSelectedEntity({type:'document', id}); navigateTo('entity_detail'); }} onDelete={(id) => setDocuments(d => d.filter(x => x.id !== id))} />}
            {currentView === 'contacts' && <ContactsList contacts={contacts} tags={tags} onRefresh={() => {}} onView={(id) => { setSelectedEntity({type:'contact', id}); navigateTo('entity_detail'); }} onDelete={(id) => setContacts(c => c.filter(x => x.id !== id))} />}
            {currentView === 'inventory' && <InventoryList items={inventory} spaces={spaces} categories={inventoryCategories} availableTags={tags} onRefresh={() => {}} onView={(id) => { setSelectedEntity({type:'inventory', id}); navigateTo('entity_detail'); }} onDelete={(id) => setInventory(i => i.filter(x => x.id !== id))} />}
            {currentView === 'inventory_categories' && <InventoryCategoriesList categories={inventoryCategories} onRefresh={() => {}} onView={(id) => { setSelectedEntity({type:'inventory_category', id}); navigateTo('entity_detail'); }} onDelete={(id) => setInventoryCategories(c => c.filter(x => x.id !== id))} />}
            {currentView === 'tags' && <TagsList tags={tags} onRefresh={() => {}} onView={(id) => { setSelectedEntity({type:'tag', id}); navigateTo('entity_detail'); }} onDelete={(id) => setTags(t => t.filter(x => x.id !== id))} />}

            {/* SYSTEM VIEWS */}
            {currentView === 'profile' && <ProfilePage />}
            {currentView === 'activity_log' && <ActivityLog activities={activities} />}
            {currentView === 'notifications_archive' && <NotificationsArchive />}
            
            {currentView === 'entity_detail' && (
              <EntityDetail 
                type={selectedEntity?.type || ''} 
                entity={findEntity()} 
                allTags={tags}
                allDocuments={documents}
                allSpaces={spaces}
                allContacts={contacts}
                allProjects={projects}
                allTasks={tasks}
                allInventory={inventory}
                allCategories={inventoryCategories}
                allProperties={properties}
                onBack={() => navigateTo(lastView || 'overview')}
                onEdit={() => {}}
                onDelete={() => {}}
                onAddNote={(text) => {}}
                onAddTag={(tag) => {}}
                onRemoveTag={(tag) => {}}
                onAddAttachment={() => {}}
                onUpdateEntity={handleUpdateEntity}
                onQuickAddContact={handleQuickAddContact}
                onNavigateToEntity={(type, id) => { setSelectedEntity({type, id}); navigateTo('entity_detail'); }}
              />
            )}
          </div>
        </main>
      </div>
      <AIAdvisor isOpen={advisorOpen} onClose={() => setAdvisorOpen(false)} currentView={currentView} households={households} />
    </div>
  );
};

export default App;
