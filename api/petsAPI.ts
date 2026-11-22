import { APIRequestContext, APIResponse } from "@playwright/test";
import { env } from "../environments";

/**
 * Service object for the pets endpoint — the API equivalent of a Page Object.
 */
export class PetsApi {
    private readonly path = env.apiURL + "/v2/pet";

    constructor(private readonly request: APIRequestContext) { }

    async addPet(pet: object): Promise<APIResponse> {
        return this.request.post(this.path, {
            data: pet
        });
    }

    /**
     * Sends the body exactly as given, for negative tests (malformed JSON, empty body, wrong content type).
     * It's sent as a Buffer because Playwright would otherwise turn an invalid JSON string into a valid
     * JSON string literal before sending it.
     */
    async addPetRaw(body: string, contentType: string = "application/json"): Promise<APIResponse> {
        return this.request.post(this.path, {
            data: Buffer.from(body),
            headers: { "Content-Type": contentType },
        });
    }

    // id can be a string so server-generated int64 IDs, which JavaScript numbers can't hold exactly, are sent unchanged.
    async getPet(id: number | string): Promise<APIResponse> {
        return this.request.get(`${this.path}/${id}`);
    }

    async deletePet(id: number | string): Promise<APIResponse> {
        return this.request.delete(`${this.path}/${id}`);
    }

}