import gql from "graphql-tag";
import { KanbanPackage } from "../fragments";

export default gql`
  mutation addUserToPackage($userId: ID!, $packageId: ID!) {
    addToUserOnPackage(
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
