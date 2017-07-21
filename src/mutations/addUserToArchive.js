import gql from "graphql-tag";
import { KanbanPackage } from "../fragments";

export default gql`
  mutation addUserToArchive($userId: ID!, $packageId: ID!) {
    addToPackageOnUserArchive(
      usersArchiveUserId: $userId,
      packagesArchivePackageId: $packageId
    ) {
        packagesArchivePackage {
          ...KanbanPackage
        }
      }
    }
  ${KanbanPackage}
`;
