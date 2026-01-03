
import React from 'react';
import { AlertCircle } from 'lucide-react';
import HouseholdDetailView from './detail/HouseholdDetailView';
import PropertyDetailView from './detail/PropertyDetailView';
import SpaceDetailView from './detail/SpaceDetailView';
import TaskDetailView from './detail/TaskDetailView';
import ProjectDetailView from './detail/ProjectDetailView';
import InventoryDetailView from './detail/InventoryDetailView';
import InventoryCategoryDetailView from './detail/InventoryCategoryDetailView';
import TagDetailView from './detail/TagDetailView';
import ContactDetailView from './detail/ContactDetailView';
import DocumentDetailView from './detail/DocumentDetailView';
import InsuranceDetailView from './detail/InsuranceDetailView';
import UtilityDetailView from './detail/UtilityDetailView';

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
  onUpdateNote?: (noteId: string, text: string) => void;
  onDeleteNote?: (noteId: string) => void;
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
  onAddNote, onUpdateNote, onDeleteNote, onAddTag, onRemoveTag, onAddAttachment, onViewItem, onNavigateToEntity, onUpdateEntity, onQuickUploadDoc, onQuickAddContact
}) => {
  if (!entity) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
      <AlertCircle size={48} className="mb-4 opacity-20" />
      <p className="font-medium text-lg">Entity not found</p>
      <button onClick={onBack} className="mt-4 text-indigo-600 font-semibold hover:underline">Go back</button>
    </div>
  );

  const getLinkedDocs = () => {
    if (
      type === 'tag' ||
      type === 'contact' ||
      type === 'inventory_category' ||
      type === 'document'
    ) {
      return [];
    }

    const entityDocIds = new Set<string>((entity.documentIds || []) as string[]);
    const entityId = entity.id as string;

    const docLinksInventoryItem = (doc: any, inventoryItemId: string) => {
      const links = doc.inventoryItems;
      if (!Array.isArray(links)) return false;
      return links.some((link: any) => {
        if (!link) return false;
        if (typeof link === 'string') return link === inventoryItemId;
        return link.inventoryItemId === inventoryItemId;
      });
    };

    const docReferencesEntity = (doc: any) => {
      switch (type) {
        case 'property':
          return doc.propertyId === entityId;
        case 'space':
          return doc.spaceId === entityId;
        case 'contact':
          return doc.contactId === entityId;
        case 'project':
          return (doc.projectIds || []).includes(entityId);
        case 'task':
          return (doc.taskIds || []).includes(entityId);
        case 'inventory':
          return docLinksInventoryItem(doc, entityId);
        default:
          return false;
      }
    };

    if (type === 'document') {
      const current = entity as any;
      const currentInventoryIds = new Set<string>(
        Array.isArray(current.inventoryItems)
          ? current.inventoryItems
              .map((x: any) => (typeof x === 'string' ? x : x?.inventoryItemId))
              .filter(Boolean)
          : []
      );

      const sharesInventory = (doc: any) => {
        const links = doc.inventoryItems;
        if (!Array.isArray(links) || currentInventoryIds.size === 0) return false;
        return links.some((x: any) => {
          const id = typeof x === 'string' ? x : x?.inventoryItemId;
          return !!id && currentInventoryIds.has(id);
        });
      };

      return allDocuments.filter((doc) => {
        if (doc.id === current.id) return false;
        if (doc.propertyId !== current.propertyId) return false;
        return (
          (!!current.spaceId && doc.spaceId === current.spaceId) ||
          (!!current.contactId && doc.contactId === current.contactId) ||
          (current.projectIds || []).some((id: string) =>
            (doc.projectIds || []).includes(id)
          ) ||
          (current.taskIds || []).some((id: string) =>
            (doc.taskIds || []).includes(id)
          ) ||
          (current.surfaceIds || []).some((id: string) =>
            (doc.surfaceIds || []).includes(id)
          ) ||
          sharesInventory(doc)
        );
      });
    }

    return allDocuments.filter((doc) => entityDocIds.has(doc.id) || docReferencesEntity(doc));
  };

  const commonProps = { 
    entity, onBack, onEdit, onDelete, 
    onAddNote, onUpdateNote, onDeleteNote, onAddTag, onRemoveTag, 
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
