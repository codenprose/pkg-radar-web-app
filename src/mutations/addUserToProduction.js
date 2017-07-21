import gql from "graphql-tag";
import { KanbanPackage } from "../fragments";

export default gql`
  mutation addUserToProduction($userId: ID!, $packageId: ID!) {
    addToPackageOnUserProduction(
      usersProductionUserId: $userId,
      packagesProductionPackageId: $packageId,
    ) {
        packagesProductionPackage {
          ...KanbanPackage
        }
      }
  }
  ${KanbanPackage}
`;
