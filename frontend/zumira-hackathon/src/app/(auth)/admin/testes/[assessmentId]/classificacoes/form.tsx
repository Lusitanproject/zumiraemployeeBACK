"use client";
import { useCallback, useEffect, useReducer, useState } from "react";
import { translateRatings } from "./methods";
import { reducer } from "./context/reducer";
import { AssessmentRating, ManageRatingSchema, NotificationType } from "./definitions";
import { Header } from "../components/header";
import { Input } from "@/components/ui/input";
import { AssessmentSummary } from "../definitions";
import { updateAssessmentRatings } from "./actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/custom/label";
import { X } from "lucide-react";

type ManageRatingsFormProps = {
  data: AssessmentSummary;
  ratings: AssessmentRating[];
  notificationTypes: NotificationType[];
};

export function ManageRatingsForm({ data, ratings, notificationTypes }: ManageRatingsFormProps) {
  const translated = translateRatings(ratings);
  const [state, dispatch] = useReducer(reducer, { ratings: translated });
  const [invalidRatings, setInvalidRatings] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [, reflow] = useState<boolean>(false);

  const handleUpdateRatings = useCallback(async () => {
    setLoading(true);
    setError(null);

    const invalid = [] as string[];
    for (const question of state.ratings) {
      const { success } = ManageRatingSchema.safeParse(question);

      if (!success) {
        if (!invalid.length) {
          document.getElementById(question.key)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        invalid.push(question.key);
      }
    }

    setInvalidRatings(invalid);

    if (!invalid.length) {
      const response = await updateAssessmentRatings(data.id, state);
      if (response.status === "ERROR") setError(response.message);
    }

    setLoading(false);
  }, [data.id, state]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex flex-col w-full">
      <Header
        onAddItem={() => dispatch({ type: "ADD-RATING" })}
        title="Editar classificações de risco"
        addItemButtonText="Cadastrar nova classificação"
      />
      <div className="w-full flex flex-col gap-3 overflow-y-auto flex-1 pt-4 pb-20">
        {state.ratings.map((item) => {
          const notificationType = notificationTypes.find((t) => t.id === item.notificationTypeId);

          return (
            <div
              id={item.key}
              key={item.key}
              className={`flex flex-row rounded-xl border bg-gray-25 duration-500 overflow-hidden justify-between ${
                invalidRatings.includes(item.key) ? "border-error-500" : "border-gray-100"
              }`}
            >
              <div
                className={`relative flex px-6 py-4 w-full border-r ${
                  invalidRatings.includes(item.key) ? "border-error-500" : "border-gray-100"
                }`}
              >
                <X
                  className="absolute -translate-x-4.5 -translate-y-3 size-4 flex-none text-gray-400"
                  onClick={() => dispatch({ type: "REMOVE-RATING", payload: { ratingKey: item.key } })}
                />
                <div className={`flex flex-row justify-between items-center w-full bg-gray-25 gap-10 `}>
                  <div className="flex w-full flex-col">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Nova classificação"
                      onChange={(e) =>
                        dispatch({ type: "CHANGE-NAME", payload: { ratingKey: item.key, name: e.target.value } })
                      }
                      defaultValue={item.name}
                    />
                  </div>
                  <div className="w-72">
                    <Label htmlFor="notification-type">Tipo de notificação</Label>
                    <Select
                      name="notification-type"
                      defaultValue={item.notificationTypeId}
                      onValueChange={(value) => {
                        dispatch({
                          type: "SET-NOTIFICATION-TYPE",
                          payload: { ratingKey: item.key, notificationTypeId: value },
                        });

                        reflow((prev) => !prev);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationTypes?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div
                className="flex w-6 duration-300"
                style={{ backgroundColor: notificationType?.color || "#FFFFFF" }}
              />
            </div>
          );
        })}
      </div>
      <div className="md:border-t border-gray-100 md:absolute md:left-0 md:right-0 md:bottom-0 py-4 md:px-16 md:bg-gray-50 flex items-center md:justify-start gap-x-3">
        <span className="text-error-500">{error}</span>
        <Button size="xl" variant="primary" onClick={handleUpdateRatings} disabled={loading}>
          {loading ? "Salvando..." : "Salvar classificações"}
        </Button>
      </div>
    </div>
  );
}
