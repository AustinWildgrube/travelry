import { EditInputs } from '&/components/edit/EditInputs';
import { usePostStore } from '&/stores/post';

export default function Edit(): JSX.Element {
  const imageUploadUri = usePostStore(state => state.imageUploadUri);
  return <>{imageUploadUri && <EditInputs image={imageUploadUri} />}</>;
}
