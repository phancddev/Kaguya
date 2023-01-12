import { useUser } from "@/contexts/AuthContext";
import supabaseClient from "@/lib/supabase";
import { SourceStatus, Watched } from "@/types";
import { MediaType } from "@/types/anilist";
import { useMutation, useQueryClient } from "react-query";

interface MutationInput {
  media_id: number;
  episode_id: string;
  watched_time?: number;
}

const useSaveWatched = () => {
  const user = useUser();
  const queryClient = useQueryClient();

  return useMutation(async (data: MutationInput) => {
    if (!user) return;

    const { episode_id, media_id, watched_time } = data;

    const sourceStatus = queryClient.getQueryData<
      SourceStatus<MediaType.Anime>
    >(["kaguya_watch_status", media_id]);

    if (sourceStatus?.status !== "COMPLETED") {
      await supabaseClient
        .from("kaguya_watch_status")
        .update({ status: "WATCHING" }, { returning: "minimal" })
        .match({
          userId: user.id,
          mediaId: media_id,
        });
    }

    const { error: upsertError } = await supabaseClient
      .from<Watched>("kaguya_watched")
      .upsert(
        {
          mediaId: media_id,
          episodeId: episode_id,
          userId: user.id,
          watchedTime: watched_time,
        },
        { returning: "minimal" }
      );

    if (upsertError) throw upsertError;

    return true;
  });
};

export default useSaveWatched;
