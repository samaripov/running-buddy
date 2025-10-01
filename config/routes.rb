Rails.application.routes.draw do
  root "run_records#index"
  resources :run_records
end
