import gql from "graphql-tag";
import { KanbanPackage } from "../fragments";

export default gql`
  mutation removeUserFromPackage($userId: ID!, $packageId: ID!) {
    removeFromUserOnPackage(
      usersUserId: $userId,
      packagesPackageId: $packageId
    ) {
        packagesPackage {
          ...KanbanPackage
        }
      }
    }
  ${KanbanPackage}
`;
