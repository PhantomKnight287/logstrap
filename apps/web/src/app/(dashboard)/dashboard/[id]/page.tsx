export default async function ProjectInfo(
  props: Record<string, Record<string, string>>,
) {
  return <>{props.params!.id}</>;
}
