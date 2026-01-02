
import React from 'react';
import { AlertCircle } from 'lucide-react';
import HouseholdDetailView from './HouseholdDetailView';
import PropertyDetailView from './PropertyDetailView';
import SpaceDetailView from './SpaceDetailView';
import TaskDetailView from './TaskDetailView';
import ProjectDetailView from './ProjectDetailView';
import InventoryDetailView from './InventoryDetailView';
import InventoryCategoryDetailView from './InventoryCategoryDetailView';
import TagDetailView from './TagDetailView';
import ContactDetailView from './ContactDetailView';
import DocumentDetailView from './DocumentDetailView';
import InsuranceDetailView from './InsuranceDetailView';
import UtilityDetailView from './UtilityDetailView';

interface EntityDetailProps {
  type: string;
  entity: any;
  allTags: any[];
  allDocuments: any[];
  allSpaces: any[];
  allContacts: any[];
  allProjects: any[];
  allTasks: any[];
  allInventory: any[];
  allCategories: any[];
  allHouseholds?: any[];
  allInsurance?: any[];
  allUtilities?: any[];
  allMembers?: any[];
  allInvites?: any[];
  allProperties?: any[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: (text: string) => void;
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagName: string) => void;
  onAddAttachment: () => void;
  onViewItem?: (id: string) => void;
  onNavigateToEntity?: (type: string, id: string) => void;
  onUpdateEntity: (type: string, id: string, data: any) => void;
  onQuickUploadDoc?: (title: string, file: any) => Promise<string>;
  // Fixed: Added onQuickAddContact to EntityDetailProps to resolve property access error in App.tsx
  onQuickAddContact?: (data: any) => Promise<string>;
}

const EntityDetail: React.FC<EntityDetailProps> = ({ 
  type, entity, allTags, allDocuments, allSpaces, allContacts, allProjects, allTasks, allInventory, allCategories, allHouseholds = [], allInsurance = [], allUtilities = [], allMembers = [], allInvites = [], allProperties = [], onBack, onEdit, onDelete, 
  onAddNote, onAddTag, onRemoveTag, onAddAttachment, onViewItem, onNavigateToEntity, onUpdateEntity, onQuickUploadDoc, onQuickAddContact
}) => {
  if (!entity) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
      <AlertCircle size={48} className="mb-4 opacity-20" />
      <p className="font-medium text-lg">Entity not found</p>
      <button onClick={onBack} className="mt-4 text-indigo-600 font-semibold hover:underline">Go back</button>
    </div>
  );

  const getLinkedDocs = () => {
    if (type === 'tag') {
      return allDocuments.filter(doc => (doc.tags || []).includes(entity.name));
    }
    return allDocuments.filter(doc => (entity.documentIds || []).includes(doc.id));
  };

  const commonProps = { 
    entity, onBack, onEdit, onDelete, 
    onAddNote, onAddTag, onRemoveTag, 
    availableTags: allTags,
    linkedDocuments: getLinkedDocs(),
    allDocuments,
    allInventory,
    allCategories,
    allHouseholds,
    allInsurance,
    allUtilities,
    availableSpaces: allSpaces,
    availableContacts: allContacts,
    availableProjects: allProjects,
    availableTasks: allTasks,
    availableInventory: allInventory,
    availableCategories: allCategories,
    allMembers,
    allInvites,
    allProperties,
    onAddAttachment,
    onViewItem,
    onNavigateToEntity,
    onUpdateEntity,
    onQuickUploadDoc,
    // Fixed: Passed onQuickAddContact through to commonProps for detail views
    onQuickAddContact
  };

  switch (type) {
    case 'household': return <HouseholdDetailView {...commonProps} />;
    case 'property': return <PropertyDetailView {...commonProps} />;
    case 'space': return <SpaceDetailView {...commonProps} />;
    case 'task': return <TaskDetailView {...commonProps} />;
    case 'project': return <ProjectDetailView {...commonProps} />;
    case 'inventory': return <InventoryDetailView {...commonProps} />;
    case 'inventory_category': return <InventoryCategoryDetailView {...commonProps} />;
    case 'tag': return <TagDetailView {...commonProps} />;
    case 'contact': return <ContactDetailView {...commonProps} />;
    case 'document': return <DocumentDetailView {...commonProps} />;
    case 'insurance': return <InsuranceDetailView {...commonProps} />;
    case 'utility': return <UtilityDetailView {...commonProps} />;
    default:
      return (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <AlertCircle size={48} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unknown Entity Type</h3>
          <p className="text-gray-500 max-w-sm mx-auto">Details for this {type} are not available.</p>
          <button onClick={onBack} className="mt-4 text-indigo-600 font-semibold hover:underline">Go back</button>
        </div>
      );
  }
};

export default EntityDetail;
