import { Skeleton, Stack } from "@mui/material"

export function StripeSkeleton() {
  return (
    <Stack spacing={1} py={5}>
      <Skeleton
        variant="text"
        animation="wave"
        sx={{ background: "#f9f9f9" }}
        width={40}
      />
      <Skeleton variant="rounded" sx={{ background: "#f9f9f9" }} height={40} />

      <Stack direction={"row"} spacing={3}>
        <Skeleton
          variant="rounded"
          sx={{ background: "#f9f9f9" }}
          width={220}
          height={60}
        />
        <Skeleton
          variant="rounded"
          sx={{ background: "#f9f9f9" }}
          width={220}
          height={60}
        />
      </Stack>

      <Skeleton
        variant="text"
        sx={{ background: "#f9f9f9" }}
        animation="wave"
        width={40}
      />
      <Skeleton variant="rounded" sx={{ background: "#f9f9f9" }} height={40} />

      <Skeleton
        variant="text"
        sx={{ background: "#f9f9f9" }}
        animation="wave"
        width={40}
      />
      <Stack direction={"row"} spacing={3}>
        <Skeleton
          variant="rounded"
          sx={{ background: "#f9f9f9" }}
          width={220}
          height={40}
        />
        <Skeleton
          variant="rounded"
          sx={{ background: "#f9f9f9" }}
          width={220}
          height={40}
        />
      </Stack>
    </Stack>
  )
}
