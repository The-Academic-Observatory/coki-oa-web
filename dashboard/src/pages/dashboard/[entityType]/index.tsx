import { Icon, Link } from "@/components/common";
import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

export type DashboardPageProps = {
  entityType: string;
};

function Dashboard({ entityType }: DashboardPageProps) {
  return (
    <>
      <Flex w="100%" direction="column">
        <Flex>
          <Link href="/dashboard/country/" flex="1" display="flex">
            <Button variant={entityType === "country" ? "tabActive" : "tabInactive"}>
              <Icon icon="website" size={24} marginRight="6px" />
              <Text fontSize={{ base: "14px", sm: "16px" }}>Country</Text>
            </Button>
          </Link>

          <Link href="/dashboard/institution/" flex="1" display="flex">
            <Button variant={entityType === "institution" ? "tabActive" : "tabInactive"}>
              <Icon icon="institution" size={24} marginRight="6px" />
              <Text fontSize={{ base: "14px", sm: "16px" }}>Institution</Text>
            </Button>
          </Link>
          <Button variant="filterTab" display={{ base: "flex", md: "none" }}>
            <Icon icon="filter" color="white" size={24} marginRight={{ base: 0, sm: "6px" }} />
            <Text color="white" display={{ base: "none", sm: "block" }}>
              Filters
            </Text>
          </Button>
        </Flex>
        <Flex>
          <p>Hello</p>
        </Flex>
      </Flex>
    </>
  );
}

type Params = {
  params: {
    entityType: string;
  };
};

export async function getStaticProps({ params }: Params) {
  return {
    props: {
      entityType: params.entityType,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { entityType: "country" } }, { params: { entityType: "institution" } }],
    fallback: "blocking",
  };
}

export default Dashboard;
