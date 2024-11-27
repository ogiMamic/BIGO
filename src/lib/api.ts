export async function fetchStories(teamId: string) {
  const response = await fetch(`/api/stories?teamId=${teamId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export async function fetchTeams() {
  const response = await fetch("/api/teams");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export async function createStory(
  title: string,
  content: string,
  teamId: string
) {
  const response = await fetch("/api/stories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content, teamId }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create story");
  }
  return await response.json();
}

export async function deleteStory(storyId: string) {
  const response = await fetch(`/api/stories/${storyId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete story");
  }
}

export async function likeStory(storyId: string) {
  const response = await fetch(`/api/stories/${storyId}/like`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Failed to like story");
  }
  return await response.json();
}

export async function commentStory(storyId: string, content: string) {
  const response = await fetch(`/api/stories/${storyId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error("Failed to add comment");
  }
  return await response.json();
}
