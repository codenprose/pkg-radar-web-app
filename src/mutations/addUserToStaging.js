import gql from "graphql-tag";
import { KanbanPackage } from "../fragments";

export default gql`
  mutation addUserToStaging($userId: ID!, $packageId: ID!) {
    addToPackageOnUserStaging(
      usersStagingUserId: $userId,
      packagesStagingPackageId: $packageId
    ) {
        packagesStagingPackage {
          ...KanbanPackage
        }
      }
  }
  ${KanbanPackage}
`;
