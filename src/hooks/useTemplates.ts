import {useWorkspace} from "@/context/WorkspaceContext";

export const useTemplates = () => {
    const { templates, loadingTemplates, createNewTemplate } = useWorkspace();
    return {
        templates,
        loading: loadingTemplates,
        createTemplate: createNewTemplate,
    };
};
